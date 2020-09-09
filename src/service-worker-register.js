const { navigator } = window


if ('serviceWorker' in navigator) {
  (async () => {
    const { serviceWorker } = navigator
    const regSW = await serviceWorker.getRegistration()


    if (regSW && regSW.active && !regSW.active.scriptURL.endsWith('{{ build_number }}')) {
      await regSW.unregister('/')
    }
    await serviceWorker.register('/offline.js?v={{ build_number }}', { scope: '/' })

    console.log('serviceWorker succeeded: v={{ build_number }}')
  })().catch(console.error)
}
