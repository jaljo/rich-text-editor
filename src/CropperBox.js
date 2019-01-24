import Cropper from 'cropperjs'

// CropperBox :: [] -> CropperWrapper
const CropperBox = cache => {

  /**
    * @type Entry {
    *   id :: String,
    *   instance :: Cropper,
    * }
    *
    * addEntry :: CropperBox a ~> Entry -> [Entry]
    */
  const addEntry = Entry => cache.push(Entry);

  // cleanCache :: CropperBox a ~> () -> Void
  const cleanCache = () => {
    cache = [];
  }

  // CropperWrapper :: String -> DecoratedCropper
  const CropperWrapper = id => {

    // try to find existing instance in the cache
    for (let entry of cache) {
      if(entry.id === id) {

        /**
          * @type DecoratedCropper {
          *   instance :: () -> Cropper
          * }
          */
        return {
          instance: () => entry.instance,
          clear: () => cleanCache(),
        }
      }
    }

    // instance matching given id doesn't exist:  create it
    const instance = new Cropper(document.querySelector(id), {
      checkCrossOrigin: true,
      zoomable: false,
      preview: '#image-crop-preview',
    })

    addEntry({ id, instance });

    // recursively call CropperWrapper : now it has been created in the cache,
    // it will therefor be returned by the for loop above and be decorated
    return CropperWrapper(id);
  }

  return CropperWrapper;
}

export default CropperBox;
