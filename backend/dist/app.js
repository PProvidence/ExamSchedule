"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const express_1 = __importDefault(require("express"));
const user_route_1 = require("./routes/user.route");
const schedule_route_1 = __importDefault(require("./routes/schedule.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', user_route_1.userRoutes);
app.use('/schedule', schedule_route_1.default);
const port = config_1.config.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
