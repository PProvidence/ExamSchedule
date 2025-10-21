"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./docs/swagger");
const student_route_1 = require("./routes/student.route");
const admin_route_1 = require("./routes/admin.route");
const auth_route_1 = require("./routes/auth.route");
const reschedule_route_1 = require("./routes/reschedule.route");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://exma-rr6x.onrender.com",
        "https://exma-rr6x.onrender.com/api-docs",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://localhost:5000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', auth_route_1.authRoutes);
app.use('/reschedule', reschedule_route_1.rescheduleRoutes);
app.use('/student', student_route_1.studentRoutes);
app.use('/admin', admin_route_1.adminRoutes);
(0, swagger_1.swaggerDocs)(app);
const port = config_1.config.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
