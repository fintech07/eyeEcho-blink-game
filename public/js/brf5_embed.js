const setupScript = (name) => {

    const scriptSwitch = document.getElementById('scriptSwitchExample')

    if (scriptSwitch) {

        scriptSwitch.parentNode.removeChild(scriptSwitch)
    }

    const path = './js/examples/' + name + '.js'

    const script = document.createElement('script')
    script.id = 'scriptSwitchExample'
    script.type = 'module'
    script.async = true
    script.innerHTML = 'import { run } from "' + path + '"; run(1)'

    document.body.append(script)
}

window.selectedSetup = 'camera';

setupScript('face_tracking__blink_detection');

