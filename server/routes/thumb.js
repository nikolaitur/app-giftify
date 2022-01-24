import path from 'path';
import mime from 'mime-types';
import fetch from 'node-fetch';
import Shopify from '~/helpers/shopify';

const thumb = async (ctx) => {
  //await new Promise(resolve => setTimeout(resolve, 600));

  const s = await Shopify(ctx);
  const product = await s.product.get(ctx.query.pid,
    { fields: 'images, variants' }
  );
  
  let image = product.images[0] ? product.images[0] : '';

  if (image != '') {
    product.images.forEach(function(img) {
      if (img.variant_ids.indexOf(parseInt(ctx.query.vid))) {
        image = img.src;
      }
    });
  }

  if (image != '') {
    const ext = path.extname(image.split('?v')[0]);
    image = image.replace(ext + '?v', '_60x60_crop_center' + ext + '?v');

    const response = await fetch(image);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      mime: mime.lookup(image.split('?v')[0]),
      stream: buffer
    }
  } else {
    return {};
  }

  return image;
  
};

export default thumb;