import cv2, numpy as np
from pathlib import Path
R=Path('/mnt/data/hero_master_package')
B=cv2.imread(str(R/'02_approx_clean_background.png'))
H,W=B.shape[:2]
assert (W,H)==(1920,1080)

def blur(x,sig):
 return cv2.GaussianBlur(x.astype(np.float32),(0,0),sig)
def smooth(a,b,x):
 t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)
y,x=np.mgrid[:H,:W].astype(np.float32)
gray=cv2.cvtColor(B,cv2.COLOR_BGR2GRAY).astype(np.float32)
# robust local clean estimate using grayscale dilated / close
small=cv2.resize(gray,(W//4,H//4),interpolation=cv2.INTER_AREA)
closed=cv2.morphologyEx(small,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(57,57)))
closed=blur(closed,4.0)
close=cv2.resize(closed,(W,H),interpolation=cv2.INTER_CUBIC)
gray_bg=blur(gray,4)
shadow_contrast=np.clip(close-gray_bg-8,0,65)
# mask window bars & diagonals, broad and softened, grounded against actual pixel dimness
geo=np.zeros((H,W),np.uint8)
cv2.line(geo,(77,-45),(155,880),255,62,cv2.LINE_AA)  # left near vertical
cv2.line(geo,(292,-50),(325,740),255,82,cv2.LINE_AA) # second near vertical
cv2.line(geo,(-180,-150),(740,655),255,76,cv2.LINE_AA) # diagonal A
cv2.line(geo,(175,-135),(990,625),255,95,cv2.LINE_AA) # diagonal B
cv2.line(geo,(-50,-20),(370,412),255,67,cv2.LINE_AA) # diagonal near upper left
geo=blur(geo,27)/255.
# above, image has window-frame shadows primarily on top-left quadrant
wall_gate=(1-smooth(855,913,y)) * (1-smooth(930,1220,x))
# keep original leaf area largely as is for light spots that are NOT window shadows, but lines can pass there
vegetation_gate=np.where((x<470)&(y>460),0.38,1.0).astype(np.float32)
wall_strength=geo*wall_gate*vegetation_gate*smooth(5,25,shadow_contrast)
wall_strength=blur(wall_strength,3)
wall_a=np.clip(wall_strength*.23,0,.21)
# floor: window stripes as dark streaks in x > 620 zone (left contains physical objects)
floor_gate=smooth(900,972,y) * smooth(560,750,x)
# dynamic shadow candidate from local contrast, steer near diagonal floor marks only
floor_strength=smooth(4,28,shadow_contrast) * np.clip(shadow_contrast/47,0,1)
floor_a=np.clip(floor_strength*floor_gate*.22,0,.17)
floor_a=blur(floor_a,2)
# Protect valuable fixed objects. Window-light shadows must never repaint furniture itself.
# floor x<650 excluded via floor_gate. wall mug/books y>=650 and x<350 untouched.
protect=np.zeros((H,W),np.float32)
cv2.rectangle(protect,(0,650),(360,1080),1,-1)
cv2.ellipse(protect,(490,955),(310,125),0,0,360,1,-1)
protect=blur(protect,15)
wall_a*=1-protect
floor_a*=1-protect
# guarantee no lightening/darkening clip for mathematically reversible decomposition.
# Use neutral warm-taupe overlay as the 'shadow pigment'. For each alpha, inverse solve source clean plate.
Bf=B.astype(np.float32)

def solve_channel(Bf,a, rgb):
    S=np.array(rgb,dtype=np.float32).reshape((1,1,3))
    amax=((255-Bf)/(255-S+1e-6)).min(axis=2)*.97
    a=np.clip(np.minimum(a,amax),0,0.42)
    C=(Bf-a[:,:,None]*S)/(1-a[:,:,None])
    C=np.clip(C,0,255)
    O=np.zeros((H,W,4),np.uint8)
    O[:,:,:3]=S.astype(np.uint8)
    O[:,:,3]=np.round(a*255).astype(np.uint8)
    return C, O, a

# Important: base creation wall then floor and reverse composite order. All channels BGR until output write.
C_floor, floor_rgba, fa=solve_channel(Bf,floor_a,(133,141,152))
C_all,wall_rgba,wa=solve_channel(C_floor,wall_a,(138,147,160))
C_all=np.clip(C_all,0,255).astype(np.uint8)
# composite window shadows as static layers, first wall then tabletop

def over(canvas,layer):
 a=layer[:,:,3:4].astype(np.float32)/255
 return np.clip(canvas*(1-a)+layer[:,:,:3].astype(np.float32)*a,0,255)
recom=over(over(C_all.astype(np.float32),wall_rgba),floor_rgba)
recom=np.rint(recom).astype(np.uint8)
diff=cv2.absdiff(recom,B)
print('window reassembly abs max',diff.max(), 'mean',diff.mean(), '99.9pct',np.percentile(diff,99.9))
D=Path('/mnt/data/window_shadow_layers_v2');D.mkdir(exist_ok=True)
cv2.imwrite(str(D/'01_base_before_window_shadow_separation.png'),B)
cv2.imwrite(str(D/'02_clean_background_window_removed.png'),C_all)
cv2.imwrite(str(D/'03_wall_window_shadows_rgba.png'),wall_rgba)
cv2.imwrite(str(D/'04_wall_window_shadows_alpha.png'),(wa*255).round().astype(np.uint8))
cv2.imwrite(str(D/'05_tabletop_window_shadows_rgba.png'),floor_rgba)
cv2.imwrite(str(D/'06_tabletop_window_shadows_alpha.png'),(fa*255).round().astype(np.uint8))
cv2.imwrite(str(D/'07_furniture_protect_mask.png'),(protect*255).round().astype(np.uint8))
cv2.imwrite(str(D/'08_reassembled_window_shadow_plate.png'),recom)
cv2.imwrite(str(D/'09_reassembly_difference_x16.png'),np.clip(diff.astype(np.float32)*16,0,255).astype(np.uint8))
# user-friendly contact sheet showing masks in context
smallsize=(960,540)
def label(im,s):
 v=cv2.resize(im,smallsize,interpolation=cv2.INTER_AREA)
 cv2.rectangle(v,(0,0),(960,38),(248,246,239),-1)
 cv2.putText(v,s,(19,27),cv2.FONT_HERSHEY_SIMPLEX,.65,(65,54,47),2,cv2.LINE_AA)
 return v
# visualize shadows as dark layers over neutral matte
maskw=np.full_like(B,245);maskw=(maskw.astype(np.float32)*(1-wa[:,:,None])).astype(np.uint8)
maskf=np.full_like(B,245);maskf=(maskf.astype(np.float32)*(1-fa[:,:,None])).astype(np.uint8)
imgs=[label(B.copy(),'Original static plate'),label(C_all.copy(),'Window shadows removed (approximate)'),label(maskw,'Window wall shadow mask'),label(maskf,'Window tabletop shadow mask'),label(recom.copy(),'Recombined plate'),label(np.clip(diff*32,0,255).astype(np.uint8),'Reassembly difference x32')]
cv2.imwrite(str(D/'10_validation_contact_sheet.jpg'),np.concatenate([np.concatenate(imgs[:3],axis=1),np.concatenate(imgs[3:],axis=1)],axis=0),[cv2.IMWRITE_JPEG_QUALITY,94])
print('window alpha wall',wa.max(), 'nonzero',(wa>.005).sum(), 'floor',fa.max(),(fa>.005).sum())
