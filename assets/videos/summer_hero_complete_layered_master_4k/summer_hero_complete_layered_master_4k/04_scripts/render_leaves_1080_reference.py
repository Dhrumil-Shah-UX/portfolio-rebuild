"""Render a subtle ambient hero animation from separated leaves + shadow layers.

Portable version for the hero_master_package folder.
Outputs:
- ./renders/hero-desktop.mp4 (1920x1080, H.264, 60 FPS)
- ./renders/hero-preview.gif (preview GIF)
- sample frames if run with --samples

Requirements:
    pip install opencv-python numpy scipy
    ffmpeg available on PATH
"""

from pathlib import Path
import math
import subprocess
import sys
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'renders'
OUT.mkdir(exist_ok=True)

W, H = 1920, 1080
FPS = 60
FRAMES = 420  # 7 seconds

original = cv2.imread(str(ROOT / '01_original_reference.png'))
background = cv2.imread(str(ROOT / '02_approx_clean_background.png'))
leaf_rgba = cv2.imread(str(ROOT / '03_olive_leaves_rgba.png'), cv2.IMREAD_UNCHANGED)
leaf_alpha = cv2.imread(str(ROOT / '04_olive_leaf_alpha.png'), cv2.IMREAD_GRAYSCALE)
shadow_rgba = cv2.imread(str(ROOT / '05_leaf_shadows_rgba.png'), cv2.IMREAD_UNCHANGED)
shadow_alpha = cv2.imread(str(ROOT / '06_leaf_shadows_matte.png'), cv2.IMREAD_GRAYSCALE)

for name, arr in {
    'original': original,
    'background': background,
    'leaf_rgba': leaf_rgba,
    'leaf_alpha': leaf_alpha,
    'shadow_rgba': shadow_rgba,
    'shadow_alpha': shadow_alpha,
}.items():
    if arr is None:
        raise FileNotFoundError(f'Missing required asset: {name}')

# normalized alpha
leaf_a = (leaf_alpha.astype(np.float32) / 255.0)
shadow_a = (shadow_alpha.astype(np.float32) / 255.0)

# working ROIs for efficiency; these match where the motion actually exists
leaf_roi = (0, 0, 520, 680)      # x0, y0, x1, y1
shadow_roi = (0, 100, 1150, 920)

lx0, ly0, lx1, ly1 = leaf_roi
sx0, sy0, sx1, sy1 = shadow_roi

leaf_rgb = leaf_rgba[..., :3].astype(np.float32)
bg = background.astype(np.float32)
orig = original.astype(np.float32)
shadow_rgb = shadow_rgba[..., :3].astype(np.float32)

lyy, lxx = np.mgrid[ly0:ly1, lx0:lx1].astype(np.float32)
syy, sxx = np.mgrid[sy0:sy1, sx0:sx1].astype(np.float32)

leaf_patch = leaf_rgb[ly0:ly1, lx0:lx1]
leaf_patch_alpha = leaf_a[ly0:ly1, lx0:lx1]
bg_leaf_patch = bg[ly0:ly1, lx0:lx1]

shadow_patch = shadow_rgb[sy0:sy1, sx0:sx1]
shadow_patch_alpha = shadow_a[sy0:sy1, sx0:sx1]

# for better consistency, shadow movement echoes leaf motion but at a softer scale

def smooth_periodic(t):
    return math.sin(t) + 0.25 * math.sin(2 * t + 0.6)


def make_frame(i: int) -> np.ndarray:
    phase = 2 * math.pi * i / FRAMES

    # Start from the approximate clean background
    frame = bg.copy()

    # --- LEAF MOTION ---
    leaf_dx = 5.0 * smooth_periodic(phase)
    leaf_dy = 1.6 * (math.cos(phase) - 1.0)
    # more movement at the tips, less at the stem side
    tip_weight = np.clip((lxx - lx0) / max(1.0, (lx1 - lx0)), 0.0, 1.0)
    bend = 0.6 + 0.4 * tip_weight
    map_x = (lxx - leaf_dx * bend).astype(np.float32)
    map_y = (lyy - leaf_dy * bend).astype(np.float32)
    moved_leaf = cv2.remap(leaf_patch, map_x - lx0, map_y - ly0, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    moved_leaf_alpha = cv2.remap(leaf_patch_alpha, map_x - lx0, map_y - ly0, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

    target = frame[ly0:ly1, lx0:lx1]
    target[:] = target * (1.0 - moved_leaf_alpha[..., None]) + moved_leaf * moved_leaf_alpha[..., None]

    # --- SHADOW MOTION ---
    shadow_dx = leaf_dx * 0.75
    shadow_dy = leaf_dy * 0.90
    wobble_x = 1.3 * math.sin(phase * 2.0 + 0.2)
    wobble_y = 0.8 * math.sin(phase * 1.7 + 1.1)
    smap_x = (sxx - shadow_dx - wobble_x).astype(np.float32)
    smap_y = (syy - shadow_dy - wobble_y).astype(np.float32)
    moved_shadow = cv2.remap(shadow_patch, smap_x - sx0, smap_y - sy0, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    moved_shadow_alpha = cv2.remap(shadow_patch_alpha, smap_x - sx0, smap_y - sy0, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

    target = frame[sy0:sy1, sx0:sx1]
    # treat shadow as a soft darkening plate rather than a solid object
    shadow_mix = moved_shadow_alpha[..., None] * 0.35
    target[:] = target * (1.0 - shadow_mix) + moved_shadow * shadow_mix

    return np.clip(frame, 0, 255).astype(np.uint8)


def render_samples():
    sample_ids = [0, FRAMES // 4, FRAMES // 2, (3 * FRAMES) // 4]
    thumbs = []
    for idx in sample_ids:
        fr = make_frame(idx)
        out = OUT / f'sample_{idx:03}.jpg'
        cv2.imwrite(str(out), fr, [int(cv2.IMWRITE_JPEG_QUALITY), 94])
        thumbs.append(cv2.resize(fr, (768, 432), interpolation=cv2.INTER_AREA))
    top = np.concatenate(thumbs[:2], axis=1)
    bottom = np.concatenate(thumbs[2:], axis=1)
    sheet = np.concatenate([top, bottom], axis=0)
    cv2.imwrite(str(OUT / 'motion_samples_contact_sheet.jpg'), sheet, [int(cv2.IMWRITE_JPEG_QUALITY), 94])
    print('Saved sample frames to', OUT)


def render_mp4():
    mp4_path = OUT / 'hero-desktop.mp4'
    ffmpeg_cmd = [
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
        '-f', 'rawvideo', '-pixel_format', 'bgr24',
        '-video_size', f'{W}x{H}', '-framerate', str(FPS), '-i', '-',
        '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-preset', 'slow', '-crf', '18', '-movflags', '+faststart',
        str(mp4_path)
    ]
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    try:
        for i in range(FRAMES):
            proc.stdin.write(make_frame(i).tobytes())
    finally:
        proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise RuntimeError('ffmpeg failed while writing MP4')
    print('Saved', mp4_path)


def render_gif_preview():
    # write a temporary MP4 first, then convert to a manageable preview GIF
    tmp_mp4 = OUT / '_tmp_preview.mp4'
    gif_path = OUT / 'hero-preview.gif'
    ffmpeg_cmd = [
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
        '-f', 'rawvideo', '-pixel_format', 'bgr24',
        '-video_size', f'{W}x{H}', '-framerate', '30', '-i', '-',
        '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-preset', 'veryfast', '-crf', '22', str(tmp_mp4)
    ]
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    try:
        for i in range(0, FRAMES, 2):
            proc.stdin.write(make_frame(i).tobytes())
    finally:
        proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise RuntimeError('ffmpeg failed while writing preview MP4')

    palette = OUT / '_palette.png'
    subprocess.check_call([
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', str(tmp_mp4),
        '-vf', 'fps=20,scale=960:-1:flags=lanczos,palettegen', str(palette)
    ])
    subprocess.check_call([
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', str(tmp_mp4), '-i', str(palette),
        '-lavfi', 'fps=20,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse', str(gif_path)
    ])
    tmp_mp4.unlink(missing_ok=True)
    palette.unlink(missing_ok=True)
    print('Saved', gif_path)


if __name__ == '__main__':
    if '--samples' in sys.argv:
        render_samples()
    else:
        render_mp4()
        render_gif_preview()
