var VERSION = "1.3"

function Component()
{
    generateTr();
}

function generateTr() {
    component.setValue("DisplayName", qsTr("CQtDeployer"));
    component.setValue("Description", qsTr("This package contains CQtDeployer"));
}


Component.prototype.createOperations = function()
{
//    // call default implementation to actually install README.txt!
    component.createOperations();
    systemIntegration();

}

function systemIntegration() {
    if (component.installationRequested() || component.updateRequested()) {
        installInSystem();
    } else if (component.uninstallationRequested()) {
        removeFromSystem();
    }

}

function installInSystem() {
    targetDir = installer.value("TargetDir", "");
    homeDir = installer.value("HomeDir", "");

    console.log("targetDir "  + targetDir)
    console.log("hometDir "  + homeDir)

    if (systemInfo.kernelType === "winnt") {

        component.addOperation('Execute', ["SETX", "cqtdeployer", targetDir + "/" + VERSION + "/cqtdeployer.exe"])


    } else {

        if (!installer.fileExists(homeDir + "/.local/bin")) {

            component.addOperation('Execute', ["mkpath", "-p", homeDir + "/.local/bin"])

            QMessageBox["warning"](qsTr("install in system"), qsTr("Installer"),
                qsTr("The \"~/local/bin\" folder was not initialized, you may need to reboot to work correctly!"),
                                   QMessageBox.Ok);

        }
        component.addOperation('Execute', ["ln", "-sf", targetDir + "/" + VERSION + "/cqtdeployer.sh",
                                           homeDir + "/.local/bin/cqtdeployer"])

    }
}

function removeFromSystem() {
    homeDir = installer.value("HomeDir", "");

    console.log("hometDir "  + homeDir)

    if (systemInfo.kernelType === "linux") {
        component.addOperation('Execute', [ "rm", "-f", homeDir + "/.local/bin/cqtdeployer"]);
    }

}
