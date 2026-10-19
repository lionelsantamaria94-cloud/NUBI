import sys,os,base64
from playwright.sync_api import sync_playwright
from PIL import Image
OUT=sys.argv[1]; ids=sys.argv[2].split(',') if len(sys.argv)>2 and sys.argv[2]!='all' else None
os.makedirs(OUT,exist_ok=True)
html='<html><body style="margin:0"><canvas id="c" width="640" height="640"></canvas><script src="draw.js"></script></body></html>'
open('page.html','w').write(html)
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':640,'height':640});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+os.path.abspath('page.html'));pg.wait_for_timeout(300)
    if ids is None: ids=pg.evaluate('DISH_IDS')
    for i in ids:
        try:
            data=pg.evaluate("id=>{const c=document.getElementById('c'),x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,640,640);drawDish(x,id);return c.toDataURL('image/webp',0.86)}",i)
            open(f'{OUT}/dish-{i}.webp','wb').write(base64.b64decode(data.split(',')[1]))
        except Exception as e: errs.append(f'{i}: {e}')
    b.close()
print('errores:',errs)
# contact sheet
ims=[(i,Image.open(f'{OUT}/dish-{i}.webp')) for i in ids if os.path.exists(f'{OUT}/dish-{i}.webp')]
cols=6;rows=(len(ims)+cols-1)//cols;S=230
from PIL import ImageDraw
sheet=Image.new('RGB',(cols*S,rows*(S+22)),'white');d=ImageDraw.Draw(sheet)
for k,(i,im) in enumerate(ims):
    x,y=(k%cols)*S,(k//cols)*(S+22);sheet.paste(im.convert('RGB').resize((S-6,S-6)),(x+3,y+3));d.text((x+6,y+S-2),i,fill='black')
sheet.save(sys.argv[3] if len(sys.argv)>3 else 'sheet.jpg',quality=85)
