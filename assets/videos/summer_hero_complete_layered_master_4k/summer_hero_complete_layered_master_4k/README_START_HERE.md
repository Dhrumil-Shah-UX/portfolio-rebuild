# Summer hero — complete layered animation master (v2)

This package adds separate **wall window shadows** and **tabletop window shadows** to the previously supplied **olive leaf + leaf shadow** assets. All still-life objects stay on the base plate.

## Important: quality level

- `01_layers_1080`: 1920×1080 layers reconstructed from the supplied flattened hero photo.
- `02_layers_4k_derived`: 3840×2160 canvases, aligned and enlarged from the 1920 working layers using high-quality interpolation. **This is upscaled 4K, not genuine new native 4K source detail.**
- These layers are **approximate reconstructions**, not original photographic layers. They are working assets for Codex to refine before release.
- The previous clean background still has mild foliage-removal ghosts and requires manual correction for aggressive movement. Do not claim a pixel-perfect shadow-free clean plate.

## Required compositing order — critical

1. `01_clean_background_without_window_shadows` (opaque base). Contains the mug, coffee, books, notebook, pencil, fixed surface textures.
2. `06_window_wall_shadows_rgba` (semi-transparent overlay; static by default).
3. `08_window_table_shadows_rgba` (semi-transparent overlay; static by default).
4. `04_leaf_shadows_rgba` (semi-transparent layer, optional gentle motion).
5. `02_olive_leaves_rgba` (semi-transparent isolated foliage, gentle movement synchronized with leaf shadows).

At rest, items 1–3 reconstruct `12_original_starter_background` to within 1 pixel/channel at 1080p. For proof, see `03_validation_previews/window_layer_validation.jpg`. **Do not** apply window shadows on top of `12_original_starter_background`: that would double-darken them.

The standalone grayscale alpha files reproduce their corresponding RGBA layer alpha and are supplied for mask editing. Use the PNG file's alpha as the authoritative opacity unless you intentionally replace it.

The original static image and reconstructed full composition are provided for reference. `14_original_poster_4k.webp` is a fallback image, not an animated output.

## Physical realism & motion recommendation

Window frames remain fixed in a stationary camera scene. Their geometric wall and tabletop shadows should therefore usually remain fixed. Moving the wall and tabletop window shadows independently by large amounts will be physically inaccurate. If desired, apply **very small coordinated sunlight shifts** to both layers (subpixel–2px at 1080p, scaled by resolution). The leaf shadow layer can sway visibly, synchronized with the olive leaves.

Always protect the mug/books/notebook/pencil with `10_furniture_protection_mask`. Window shadow layers on the tabletop have deliberately been limited outside the furniture area.

## Verification

From the package root:

```bash
python 04_scripts/verify_composites.py
```

Checks pixel-level still-frame reconstruction and protection masks. Do a final human review of rendered motion in VLC and browsers. With a still-photo reconstruction, fast/large displacement may reveal shadows baked into the plate or foliage edge artifacts.

## Source and usage notes

`04_scripts/render_leaves_1080_reference.py` is a starter example from the prior bundle; it does **not** automatically compose the new separated window shadow layers. Update its base-layer loading and follow the order above if extending it. `04_scripts/build_window_shadows_reference.py` documents how the new window extraction was approximated and uses the earlier project-local paths; it is reference code, not a standalone script.

## Deliverables

This is a layered-source package, not a verified finished animation. It prepares separated window shadow assets for Codex. For high-quality new 4K detail beyond upscaling, obtain a native 4K source image or regenerate it with controlled reference alignment, then re-extract all masks.
