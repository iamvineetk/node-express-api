import Role from "../models/Role.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const createRole = async (req, res, next) => {
    try {
        if(req.body.role && req.body.role !== '') {
            const newRole = new Role(req.body);
            await newRole.save();
            return next(CreateSuccess(201, "Role created!"));
        } else {
            return next(CreateError(400, "Bad request!"));
        }
    } catch (error) {
        return next(CreateError());
    }
}

export const updateRole = async (req, res, next) => {
    try {
        const role = await Role.findById({_id:req.params.id});
        if(role) {
            const newData = await Role.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            return next(CreateSuccess(204, "Role Updated!"));
        } else {
            return next(CreateError(404, "Role not found!"));
        }
    } catch (error) {
        return next(CreateError());
    }
}

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find({});
        return res.status(200).send(roles);
    } catch (error) {
        return next(CreateError());
    }
}

export const deleteRole = async (req, res, next) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findById({_id: roleId});
        if(role) {
            await Role.findByIdAndDelete(roleId);
            return next(CreateSuccess(200, "Role deleted!"));
        } else {
            return next(CreateError(400, "Role not found!"));
        }
    } catch (error) {
        return next(CreateError());
    }
}