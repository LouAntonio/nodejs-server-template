const logger = require('../utils/logger.util.js');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const isAuthenticated = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ success: false, msg: 'Usuário não identificado, faça login para continuar!', auth: true });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_USERSECRET);
		req.user = decoded;

		const now = Math.floor(Date.now() / 1000);
		const bufferTime = 60 * 15; // buffer de 15 minutos
		if (decoded.exp - now < bufferTime) {
			const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email, role: decoded.role },
				process.env.JWT_USERSECRET,
				{ expiresIn: '1h' }
			);
			res.setHeader('x-renewed-token', newToken);
		}

		next();
	} catch (error) {
		logger.error('Erro de autenticação:', error);
		return res.status(401).json({ success: false, msg: 'Autorização inválida ou expirada, faça login para continuar!', auth: true });
	}
};

const isAdmin = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ success: false, msg: 'Usuário não identificado, faça login para continuar!', auth: true });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
		
		// Verifica se o usuário tem role de admin (ft)
		if (decoded.role !== 'ft') {
			return res.status(403).json({ success: false, msg: 'Acesso negado. Privilégios de administrador necessários.' });
		}

		req.user = decoded;

		const now = Math.floor(Date.now() / 1000);
		const bufferTime = 60 * 15; // buffer de 15 minutos
		if (decoded.exp - now < bufferTime) {
			const newToken = jwt.sign(
				{ userId: decoded.userId, role: decoded.role },
				process.env.JWT_ADMIN_SECRET,
				{ expiresIn: '1h' }
			);
			res.setHeader('x-renewed-token', newToken);
		}

		next();
	} catch (error) {
		logger.error('Erro de autenticação admin:', error);
		return res.status(401).json({ success: false, msg: 'Autorização inválida ou expirada, faça login para continuar!', auth: true });
	}
};

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 5,
	handler: (req, res, /*next*/) => {
		return res.status(429).json({ success: false, msg: 'Muitas tentativas de login. Tente novamente daqui a 15 minutos.' });
	}
});

// Middleware de autenticação opcional - não bloqueia se não houver token
const optionalAuth = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		// Se não houver token, continua sem autenticação
		return next();
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_USERSECRET);
		req.user = decoded;

		const now = Math.floor(Date.now() / 1000);
		const bufferTime = 60 * 15; // buffer de 15 minutos
		if (decoded.exp - now < bufferTime) {
			const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email, role: decoded.role },
				process.env.JWT_USERSECRET,
				{ expiresIn: '1h' }
			);
			res.setHeader('x-renewed-token', newToken);
		}

		next();
	} catch (error) {
		next();
	}
};

// Middleware opcional de autenticação admin - não bloqueia se não houver token
const optionalAdminAuth = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		// Se não houver token, continua sem autenticação
		return next();
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
		
		// Verifica se o usuário tem role de admin (ft)
		if (decoded.role !== 'ft') {
			return next();
		}

		req.user = decoded;

		const now = Math.floor(Date.now() / 1000);
		const bufferTime = 60 * 15; // buffer de 15 minutos
		if (decoded.exp - now < bufferTime) {
			const newToken = jwt.sign(
				{ userId: decoded.userId, role: decoded.role },
				process.env.JWT_ADMIN_SECRET,
				{ expiresIn: '1h' }
			);
			res.setHeader('x-renewed-token', newToken);
		}

		next();
	} catch (error) {
		next();
	}
};

module.exports = {
	isAuthenticated,
	isAdmin,
	loginLimiter,
	optionalAuth,
	optionalAdminAuth
};
