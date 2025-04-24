import * as PIXI from 'pixi.js';
import React from 'react';

const PixiCanvas = ({castContext}) => {
  const canvasRef = React.useRef(null);
  const pixiAppRef = React.useRef(null); // Référence persistante de PIXI.Application
  const spriteRef = React.useRef(null); // Référence à ton sprite principal
  const [posX, setPosX] = React.useState(30);
  const [posY, setPosY] = React.useState(30);

  React.useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: 1080,
      height: 720,
      backgroundAlpha: 0,
    });

    pixiAppRef.current = app;

    const backgroundTexture = PIXI.Texture.from('/back.jpg');
    const backgroundSprite  = new PIXI.Sprite(backgroundTexture);
    backgroundSprite.width = app.screen.width;
    backgroundSprite.height = app.screen.height;
    backgroundSprite.anchor.set(0); // alignement haut-gauche
    backgroundSprite.position.set(0, 0);
    app.stage.addChild(backgroundSprite);
    
    PIXI.Assets.load('/champi2.png').then((texture) => {
      const champignon = new PIXI.Sprite(texture);
      champignon.anchor.set(2);
      champignon.x = app.renderer.width / 2;
      champignon.y = app.renderer.height / 2;
      champignon.scale.set(1);
      app.stage.addChild(champignon); 
    });

    const text = new PIXI.Text('Bienvenue à mon jeu', {
      fontFamily: 'Arial',
      fontSize: 44,
      fill: 0xffffff,
    });
    // Coordonnées du texte
    text.x = 300;
    text.y = 400;
    // Ajout du texte à la vue principale
    app.stage.addChild(text);

    // Un exemple de forme en Pixi
    const bonhommeCarre = new PIXI.Graphics();
    bonhommeCarre.beginFill(0xff0000);
    bonhommeCarre.drawRect(posX+30, posY+30, 20, 20);
    bonhommeCarre.endFill();
    spriteRef.current = bonhommeCarre;
    app.stage.addChild(bonhommeCarre);

    return () => {
      app.destroy(true, true);
    };
  }, []);


  React.useEffect(() => {
    if (!castContext) return;

    const CHANNEL = 'urn:x-cast:testChannel';
    castContext.addCustomMessageListener(CHANNEL, function(customEvent) {
      // TODO ici mettre une structure json de votre choix.
      const pos = customEvent.data.msg.split(',');    
      setPosX(pos[0]);
      setPosY(pos[1]);
      spriteRef.current.x = pos[0] ?? spriteRef.current.x;
      spriteRef.current.y = pos[1] ?? spriteRef.current.y;
    });
    
  }, [castContext]);


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PixiCanvas;