const express = require('express')
const router = new express.Router()
const axios = require('axios')
const _ = require('lodash')
const moment = require('moment')

router.get('/sortedCampaigns', async (req, res) => {
    try {
        var response = await axios.get('https://testapi.donatekart.com/api/campaign')
        var data = response.data
        var sortedCampaigns = _.orderBy(data, ['totalAmount'], ['desc'])
        var finalResult = _.map(sortedCampaigns, ({ title, totalAmount, backersCount, endDate }) => ({ title, totalAmount, backersCount, endDate }))
        res.send(finalResult)
    } catch (e) {
        console.log("Error - ", e)
        res.send({ "error": e.message })
    }
})

router.get('/activeCampaigns', async (req, res) => {
    try {
        var response = await axios.get('https://testapi.donatekart.com/api/campaign')
        var data = response.data
        var today = moment()
        var finalResult = _.filter(data, (r) => {
            let endDate = r.endDate
            let campaignEndDay = moment(endDate)
            let diff = campaignEndDay.diff(today, 'days')
            return diff >= 0
        })
        var filter = _.get(req, ['query', 'filter'])
        if (filter === "last30days") {
            finalResult = _.filter(finalResult, (r) => {
                let createdDate = r.created
                let campaignStartDay = moment(createdDate)
                let diff = today.diff(campaignStartDay, 'days')
                return diff <= 30 && diff >= 0
            })
        }
        res.send(finalResult)
    } catch (e) {
        console.log("Error - ", e)
        res.send({ "error": e.message })
    }
})

router.get('/closedCampaigns', async (req, res) => {
    try {
        var response = await axios.get('https://testapi.donatekart.com/api/campaign')
        var data = response.data
        var today = moment()
        var finalResult = _.filter(data, (r) => {
            let endDate = r.endDate
            let campaignEndDay = moment(endDate)
            let diff = campaignEndDay.diff(today, 'days')
            return diff < 0 || (r.procuredAmount >= r.totalAmount)
        })
        console.log("lengthhh", finalResult.length)
        res.send(finalResult)
    } catch (e) {
        console.log("Error - ", e)
        res.send({ "error": e.message })
    }
})

module.exports = router