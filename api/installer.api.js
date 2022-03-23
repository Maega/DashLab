const router = require('express').Router();
const installer = require('../drivers/installer/installer.driver');

router.get('/repo', async (req, res) => res.json(await installer.listRepo()));

router.get('/install/:id', async (req, res) => {
    console.log('To Install: ' + req.params.id);
    await installer.install(req.params.id);
    res.json({success: true});
});

router.get('/uninstall/:id', async (req, res) => {
    console.log('To Uninstall: ' + req.params.id);
    await installer.uninstall(req.params.id);
    res.json({success: true});
});

module.exports = router;