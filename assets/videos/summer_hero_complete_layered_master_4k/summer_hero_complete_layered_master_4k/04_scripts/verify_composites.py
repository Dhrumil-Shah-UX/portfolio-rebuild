"""Verify 1080 window-shadow plate and 4k scaled layers.
Run from the package root: python 04_scripts/verify_composites.py
Requires: pip install opencv-python numpy
"""
from pathlib import Path
import cv2, numpy as np
ROOT=Path(__file__).resolve().parents[1]
for folder in ['01_layers_1080','02_layers_4k_derived']:
 p=ROOT/folder
 suf='_4k' if folder.startswith('02') else ''
 def read(name):
  q=p/(name+suf+'.png'); im=cv2.imread(str(q),cv2.IMREAD_UNCHANGED)
  if im is None:raise RuntimeError(f'Missing {q}')
  return im
 bg=read('01_clean_background_without_window_shadows').astype(np.float32)
 wall=read('06_window_wall_shadows_rgba')
 table=read('08_window_table_shadows_rgba')
 target=read('12_original_starter_background').astype(np.float32)
 def over(a,b):
  alpha=b[:,:,3:4].astype(np.float32)/255
  return a*(1-alpha)+b[:,:,:3].astype(np.float32)*alpha
 result=over(over(bg,wall),table)
 err=np.abs(result-target)
 print(folder,'reassembly MAE',round(float(err.mean()),3),'max',round(float(err.max()),3),'resolution',bg.shape[1],bg.shape[0])
 assert err.mean()<.5, 'Reassembly discrepancy unexpectedly high'
 protect=read('10_furniture_protection_mask').astype(np.float32)/255
 mat=(wall[:,:,3].astype(np.float32)+table[:,:,3].astype(np.float32))/255
 protected=(protect>.92)
 print('Protected high-opacity region max shadow alpha',round(float(mat[protected].max()) if protected.any() else 0,4))
