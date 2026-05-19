/// <reference path="../types/session.d.ts" />
import { Request, Response } from 'express'
import * as UserModel from '../models/user.model'

export const deactivateUserAction = async (req: Request, res: Response) => {
    const { role } = req.session
    const id = parseInt(req.params.id as string)

    if (role !== 'ADMIN') {
        return res.status(403).render('403', { message: 'No tienes los permisos necesarios '})
    }      
    try {
        await UserModel.softDelete(id)
        res.redirect('/affiliates')
    } catch {
        res.status(404).render('404', { message: 'Afiliado no encontrado '})
    }
}    

export const activateUserAction = async (req: Request, res: Response) => {
    const { role } = req.session
    const id = parseInt(req.params.id as string)

    if (role !== 'ADMIN') {
        return res.status(403).render('403', { message: 'No tienes los permisos necesarios '})
    }      
    try {
        await UserModel.activate(id)
        res.redirect('/affiliates')
    } catch {
        res.status(404).render('404', { message: 'Afiliado no encontrado '})
    }
}    