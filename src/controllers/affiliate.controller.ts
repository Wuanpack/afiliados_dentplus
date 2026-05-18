import { Request, Response } from 'express'
import * as AffiliateModel from '../models/affiliate.model'
import {affiliateSchema } from '../schemas/affiliate.schemas'
import { formatZodErrors } from '../lib/parseError'

export const index = async (req: Request, res: Response) => {
    const affiliates = await AffiliateModel.getAll(req.session.userId!)
    res.render('affiliates/index', { affiliates })
}

