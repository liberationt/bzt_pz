export default function (type, key, data) {
    if (type === 1) {
      // 创建一个StorageEvent事件
      var newStorageEvent = document.createEvent('StorageEvent')
      const storage = {
        setItem: function (k, val) {
          localStorage.setItem(k, val)
          // 初始化创建的事件
          newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
          // 派发对象
          window.dispatchEvent(newStorageEvent)
        }
      }
      return storage.setItem(key, data)
    } else {
      // 创建一个StorageEvent事件
      var newStorageEvent1 = document.createEvent('StorageEvent')
      const storage = {
        setItem: function (k, val) {
          sessionStorage.setItem(k, val)
          // 初始化创建的事件
          newStorageEvent1.initStorageEvent('setItem', false, false, k, null, val, null, null)
          // 派发对象
          window.dispatchEvent(newStorageEvent1)
        }
      }
      return storage.setItem(key, data)
    }
  }