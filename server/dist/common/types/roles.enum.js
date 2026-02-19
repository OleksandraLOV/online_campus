"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_HIERARCHY = exports.Role = void 0;
var Role;
(function (Role) {
    Role["STUDENT"] = "student";
    Role["TEACHER"] = "teacher";
    Role["DISPATCHER"] = "dispatcher";
    Role["DEPARTMENT_HEAD"] = "department_head";
    Role["DEAN"] = "dean";
    Role["RECTOR"] = "rector";
    Role["PRESIDENT"] = "president";
    Role["ADMIN"] = "admin";
})(Role || (exports.Role = Role = {}));
exports.ROLE_HIERARCHY = {
    [Role.STUDENT]: [],
    [Role.TEACHER]: [],
    [Role.DISPATCHER]: [],
    [Role.DEPARTMENT_HEAD]: [Role.TEACHER],
    [Role.DEAN]: [Role.DEPARTMENT_HEAD, Role.TEACHER],
    [Role.RECTOR]: [Role.DEAN, Role.DEPARTMENT_HEAD, Role.TEACHER],
    [Role.PRESIDENT]: [Role.RECTOR, Role.DEAN, Role.DEPARTMENT_HEAD, Role.TEACHER, Role.STUDENT],
    [Role.ADMIN]: [],
};
//# sourceMappingURL=roles.enum.js.map