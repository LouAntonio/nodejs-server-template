const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const middleware = require('../middlewares/auth.middleware');

/**
 * @openapi
 * tags:
 *   - name: Autenticação
 *     description: Registo e login de utilizadores
 *   - name: Utilizadores
 *     description: Gestão de utilizadores (Admin)
 */

// ─── Registo ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /users/check-email:
 *   post:
 *     tags: [Autenticação]
 *     summary: Verificar se o email já existe e enviar OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP enviado com sucesso
 *       409:
 *         description: Email já registado
 */
router.post('/check-email', userController.checkEmailExists);

/**
 * @openapi
 * /users/verify-otp:
 *   post:
 *     tags: [Autenticação]
 *     summary: Verificar código OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP válido
 *       400:
 *         description: OTP inválido ou expirado
 */
router.post('/verify-otp', userController.checkOTP);

/**
 * @openapi
 * /users/resend-otp:
 *   post:
 *     tags: [Autenticação]
 *     summary: Reenviar código OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP reenviado
 */
router.post('/resend-otp', userController.OTPResend);

/**
 * @openapi
 * /users/complete-registration:
 *   post:
 *     tags: [Autenticação]
 *     summary: Completar registo do utilizador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, surname, phone, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Utilizador registado com sucesso
 */
router.post('/complete-registration', userController.completeRegistration);

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Login de utilizador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 *       429:
 *         description: Muitas tentativas de login
 */
router.post('/login', middleware.loginLimiter, userController.login);

/**
 * @openapi
 * /users/admin/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Login de administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login admin bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Acesso negado
 */
router.post('/admin/login', middleware.loginLimiter, userController.adminLogin);

// ─── Recuperação de senha ─────────────────────────────────────────────────────

/**
 * @openapi
 * /users/request-password-reset:
 *   post:
 *     tags: [Autenticação]
 *     summary: Solicitar reset de senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de reset enviado
 */
router.post('/request-password-reset', userController.requestPasswordReset);

/**
 * @openapi
 * /users/reset-password:
 *   post:
 *     tags: [Autenticação]
 *     summary: Redefinir senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset-password', userController.resetPassword);

// ─── Listagem de utilizadores ─────────────────────────────────────────────────

/**
 * @openapi
 * /users/list:
 *   post:
 *     tags: [Utilizadores]
 *     summary: Listar utilizadores (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 default: 1
 *               limit:
 *                 type: integer
 *                 default: 20
 *               search:
 *                 type: string
 *                 description: Pesquisa por nome, apelido, email ou telefone
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *               role:
 *                 type: string
 *                 enum: [user, ft]
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:         { type: string, format: uuid }
 *                           name:       { type: string }
 *                           surname:    { type: string }
 *                           email:      { type: string }
 *                           phone:      { type: string }
 *                           role:       { type: string, enum: [user, ft] }
 *                           status:     { type: string, enum: [active, inactive, suspended] }
 *                           lastLogin:  { type: string, format: date-time }
 *                           createdAt:  { type: string, format: date-time }
 *                           updatedAt:  { type: string, format: date-time }
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:      { type: integer }
 *                         page:       { type: integer }
 *                         limit:      { type: integer }
 *                         totalPages: { type: integer }
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.post('/list', userController.listUsers);

// ─── Gestão de utilizadores ───────────────────────────────────────────────────

/**
 * @openapi
 * /users/update-role:
 *   patch:
 *     tags: [Utilizadores]
 *     summary: Alterar role de utilizador (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, role]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 enum: [user, ft]
 *     responses:
 *       200:
 *         description: Role atualizado
 *       401:
 *         description: Não autorizado
 */
router.patch('/update-role', middleware.isAdmin, userController.updateUserRole);

/**
 * @openapi
 * /users/toggle-status:
 *   patch:
 *     tags: [Utilizadores]
 *     summary: Ativar/suspender utilizador (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Status atualizado
 *       401:
 *         description: Não autorizado
 */
router.patch('/toggle-status', middleware.isAdmin, userController.toggleUserStatus);

// ─── Sessão ───────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /users/is-logged-in:
 *   get:
 *     tags: [Autenticação]
 *     summary: Verificar se o utilizador está autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de autenticação
 */
router.get('/is-logged-in', middleware.optionalAuth, userController.isLoggedIn);

/**
 * @openapi
 * /users/admin/is-logged-in:
 *   get:
 *     tags: [Autenticação]
 *     summary: Verificar se o administrador está autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de autenticação do admin
 */
router.get('/admin/is-logged-in', middleware.optionalAdminAuth, userController.isLoggedIn);

module.exports = router;

