const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger.util.js');const prisma = require('../configs/prisma.js');

// ─── Registo ────────────────────────────────────────────────────────────────

const checkEmailExists = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

const checkOTP = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

const OTPResend = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

const completeRegistration = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

// ─── Autenticação ───────────────────────────────────────────────────────────

const login = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

const adminLogin = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

const isLoggedIn = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

// ─── Recuperação de senha ───────────────────────────────────────────────────

const requestPasswordReset = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

const resetPassword = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

// ─── Listagem de utilizadores ───────────────────────────────────────────────

/**
 * POST /users/list
 * Body: { page, limit, search, status, role }
 * Requer: isAdmin
 */
const listUsers = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 20,
			search = '',
			status,
			role,
		} = req.body;

		const skip = (Number(page) - 1) * Number(limit);
		const take = Number(limit);

		// Filtros dinâmicos
		const where = {};

		if (search && search.trim() !== '') {
			const term = search.trim();
			where.OR = [
				{ name:    { contains: term, mode: 'insensitive' } },
				{ surname: { contains: term, mode: 'insensitive' } },
				{ email:   { contains: term, mode: 'insensitive' } },
				{ phone:   { contains: term, mode: 'insensitive' } },
			];
		}

		if (status) {
			where.status = status;
		}

		if (role) {
			where.role = role;
		}

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				skip,
				take,
				orderBy: { createdAt: 'desc' },
				select: {
					id:        true,
					name:      true,
					surname:   true,
					email:     true,
					phone:     true,
					role:      true,
					status:    true,
					lastLogin: true,
					createdAt: true,
					updatedAt: true,
				},
			}),
			prisma.user.count({ where }),
		]);

		return res.status(200).json({
			success: true,
			data: {
				users,
				pagination: {
					total,
					page:       Number(page),
					limit:      take,
					totalPages: Math.ceil(total / take),
				},
			},
		});
	} catch (error) {
		logger.error('Erro ao listar utilizadores:', error);
		return res.status(500).json({ success: false, msg: 'Erro interno ao listar utilizadores.' });
	}
};

// ─── Gestão de utilizadores (Admin) ────────────────────────────────────────

const updateUserRole = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

const toggleUserStatus = async (req, res) => {
	res.status(501).json({ success: false, msg: 'Não implementado.' });
};

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
	checkEmailExists,
	checkOTP,
	OTPResend,
	completeRegistration,
	login,
	adminLogin,
	isLoggedIn,
	requestPasswordReset,
	resetPassword,
	listUsers,
	updateUserRole,
	toggleUserStatus,
};
