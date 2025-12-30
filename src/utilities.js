export const drawRect = (detections, ctx) => {
  detections.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const text = prediction.class;

    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ff0000ff";

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
    ctx.fillText(text, x, y > 10 ? y - 5 : 10);
  });
};
