const express = require('express');
const router = express.Router();
const userRoutes = require('./user.router.js');

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Geral
 *     summary: Estado da API
 *     responses:
 *       200:
 *         description: API online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 msg: { type: string, example: API online }
 *                 version: { type: string, example: 1.0.0 }
 */
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		msg: 'API online',
		version: '1.0.0',
	});
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Geral
 *     summary: Verificar saúde da API
 *     responses:
 *       200:
 *         description: API saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 msg: { type: string, example: API is healthy }
 *                 uptime: { type: string, example: "0 days, 0 hours, 5 minutes, 30 seconds" }
 */
router.get('/health', (req, res) => {
	const uptimeSec = Math.floor(process.uptime());
	let sec = uptimeSec;
	const days = Math.floor(sec / 86400);
	sec -= days * 86400;
	const hours = Math.floor(sec / 3600);
	sec -= hours * 3600;
	const minutes = Math.floor(sec / 60);
	sec -= minutes * 60;

	res.status(200).json({
		success: true,
		msg: 'API is healthy',
		uptime: `${days} days, ${hours} hours, ${minutes} minutes, ${sec} seconds`,
	});
});

router.use('/users', userRoutes);

module.exports = router;
