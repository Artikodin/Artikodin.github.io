// La class BufferLoader initialise les fichiers à charger
// Parametre :
//		-contexte: le context audio dans lequel vont etre charge les donnés
//		-urlList: liste des differents fichiers audio qui seront chargés
//		-callback: la fonction callback appelé une fois tous les fichier chargés
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  
      this.loadBuffer = function(url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
  
        var loader = this;
  
        request.onload = function() {
          // Asynchronously decode the audio file data in request.response
          loader.context.decodeAudioData(
            request.response,
            function(buffer) {
              if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
              }
              loader.bufferList[index] = buffer;
              if (++loader.loadCount == loader.urlList.length)
                loader.onload(loader.bufferList);
            },
            function(error) {
              console.error('decodeAudioData error', error);
            }
          );
        }
  
        request.onerror = function() {
          alert('BufferLoader: XHR error');
        }
  
        request.send();
      }
  
      // Pour chaque url ajouté dans la liste on instancie la fonction
      // loadBuffer aavec pour parametre le nom de l'url ainsi que son index
      this.load = function() {
        for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
      }
  }