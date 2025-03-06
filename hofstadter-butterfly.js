/* Hofstadter butterfly in HTML5 canvas,
 * ported by Lars Huttar from Java applet at
 * https://web.archive.org/web/20010528223855/http://wptx15.physik.uni-wuerzburg.de/TP3/source_java/hofstadter.java
 * from the book Physics by Computer, by Wolfgang Kinzel and Georg Reents 
 * http://e-versity.8m.com/concerto/PhysicsbyComputer.htm

 For more on the Butterfly, see https://en.wikipedia.org/wiki/Hofstadter%27s_butterfly

 */
var keepRunning = true;
var canvas, ctx, w, h;
var q=4, qmax = 280;
var MAXX, MAXY;

// flip x, y
function drawPoint(x, y) {
   // console.log('drawPoint(', x, y, ')');
   ctx.beginPath();
   ctx.fillRect(y, x, 1, 1);
   ctx.stroke();
}

function next() {
   $('#qValue').text(q);
   // puffer=createImage(getSize().width,getSize().height);
   // puffer=createImage(600,500);
   // pufferG=puffer.getGraphics();
   // Increase qmax for greater detail, at the expense of more time.
   var p, i, j, ie, n, nalt = 0,
      m, neu;
   var sigma, e, polyalt, poly, polyneu;
   var doubleCosSigma, doubleCosSigmaQ_2, invQ = 1.0/q;

   ctx.strokeStyle = 'black';
   ctx.fillStyle = 'black';
   // pufferG.setColor(Color.black);
   // for q=2 the points (eigenvalues) are explicitly drawn

   for (p = 1; p < q; p += 2) {
      if (gcd(p, q) > 1) continue;
      sigma = 2.0 * Math.PI * p * invQ;
      // optimize by caching 1/q, cos(sigma), etc.
      // Is there a trig identity that will help us optimize cos(sigma * m)?
      // I don't think so, except where m=2.
      doubleCosSigma = 2.0 * Math.cos(sigma);
      doubleCosSigmaQ_2 = 2.0 * Math.cos(sigma * q * 0.5);
      nalt = 0;
      for (ie = 0; ie < MAXY + 2; ie++) {
         e = 8.0 * ie / MAXY - 4.0 - 4.0 / MAXY;
         n = 0;
         /* odd wavefunctions  */
         polyalt = 1.0;
         poly = doubleCosSigma - e;
         if (polyalt * poly < 0.0) n++;
         for (m = 2; m < q / 2; m++) {
            polyneu = (2.0 * Math.cos(sigma * m) - e) * poly - polyalt;
            if (poly * polyneu < 0.0) n++;
            polyalt = poly;
            poly = polyneu;
         }
         polyalt = 1.0;
         poly = 2.0 - e;
         if (polyalt * poly < 0.0) n++;
         polyneu = (doubleCosSigma - e) * poly - 2.0 * polyalt;
         if (poly * polyneu < 0.0) n++;
         polyalt = poly;
         poly = polyneu;
         for (m = 2; m < q / 2; m++) {
            polyneu = (2.0 * Math.cos(sigma * m) - e) * poly - polyalt;
            if (poly * polyneu < 0.0) n++;
            polyalt = poly;
            poly = polyneu;
         }
         polyneu = (doubleCosSigmaQ_2 - e) * poly - 2.0 * polyalt;
         if (poly * polyneu < 0.0) n++;
         /* even wavefunctions  */
         polyalt = 1.0;
         poly = 2.0 - e;
         if (polyalt * poly < 0.0) n++;
         polyneu = (doubleCosSigma - e) * poly - 2.0 * polyalt;
         if (poly * polyneu < 0.0) n++;
         polyalt = poly;
         poly = polyneu;
         for (m = 2; m < q / 2; m++) {
            polyneu = (2.0 * Math.cos(sigma * m) - e) * poly - polyalt;
            if (poly * polyneu < 0.0) n++;
            polyalt = poly;
            poly = polyneu;
         }
         polyneu = (doubleCosSigmaQ_2 - e) * poly - 2.0 * polyalt;
         if (poly * polyneu < 0.0) n++;

         if (n > nalt) {
            // if(neu==1) {g.drawImage(puffer,0,0,this);neu=0;}
            drawPoint(MAXX * p * invQ, MAXY - ie);
            // pufferG.drawLine(MAXX*p/q,MAXY-ie,MAXX*p/q,MAXY-ie);
         }
         nalt = n;
      }
   }
   // TODO: drawString("q= " + q);

   q += 2;
   if (keepRunning && q <= qmax) {
      // stop and give UI a chance to catch up, between iterations of q
      window.setTimeout(next, 1);
   }
}

function start() {
   canvas = document.getElementById('theCanvas');
   ctx = canvas.getContext('2d');
   ctx.clearRect(0, 0, canvas.width, canvas.height);     

   w = canvas.scrollWidth;
   h = canvas.scrollHeight;
   MAXX = w;
   MAXY = h;

   drawPoint(MAXX / 2, MAXY * (1 - (4 + Math.sqrt(8)) / 8));
   drawPoint(MAXX / 2, MAXY * (1 - (4 - Math.sqrt(8)) / 8));

   q = 4;
   keepRunning = true;
   window.setTimeout(next, 2);
}

function stop() {
  keepRunning = false;
}

function gcd(a, b) {
   if (b == 0) return a;
   return gcd(b, a % b);
}