const express = require('express')
const router = express.Router()

const { User } = require('../models')

router.get('/', (req, res) => {
    const data = {
        meta: {
            title: 'Admin / Dashboard',
            sidebarActive: 'dashboard',
        },
        layout: 'admin',
        data: { currentUser: req.user },
    }
    return res.render('admin/index', data)
})

router.get('/manage/users', async (req, res) => {
    if (req.query.page === undefined) {
        return res.redirect('?page=1')
    }

    const pageNo = parseInt(req.query.page)

    // Data only used if, before coming to this endpoint, a user was updated.
    const notifs = req.signedCookies.notifs || 'null然シテnull然シテnull'
    const notifsData = notifs.split('然シテ') // Why 然シテ as a splitter? Because the chances of anyone using soushite in their name is 0.000001% with the fact that this is written in Katakana instead of Hiragana like any normal human being would. Why not a comma, because people like Elon Musk exists and they name their child like they are playing osu!, just that they are smashing their keyboards.
    const entriesPerPage = 15

    const userObjects = await User.findAll({
        where: { is_admin: false },
        limit: entriesPerPage,
        offset: (pageNo - 1) * entriesPerPage,
        raw: true,
    })

    const totalNumberOfPages = Math.ceil(
        (await User.count({ where: { is_admin: false } })) / entriesPerPage,
    )


    const data = {
        meta: {
            title: 'Admin / Manage Users',
            sidebarActive: 'users',
        },
        layout: 'admin',

        data: {
            currentUser: req.user,
            updatedMessage: {
                updatedUser: notifsData[1],
                status: notifsData[0],
                err: notifsData[2],
            },
            users: userObjects,
            pagination: {
                firstPage: 1,
                lastPage: totalNumberOfPages,
                previous: pageNo - 1,
                current: pageNo,
                next: pageNo + 1,
            },
        },
    }
    return res.render('admin/users', data)
})

module.exports = router
