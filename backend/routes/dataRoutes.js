const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// Helper function to build filter object
const buildFilter = (query) => {
  const filter = {};
  if (query.end_year && query.end_year !== 'all') filter.end_year = query.end_year;
  if (query.topic && query.topic !== 'all') filter.topic = query.topic;
  if (query.sector && query.sector !== 'all') filter.sector = query.sector;
  if (query.region && query.region !== 'all') filter.region = query.region;
  if (query.pestle && query.pestle !== 'all') filter.pestle = query.pestle;
  if (query.source && query.source !== 'all') filter.source = query.source;
  if (query.country && query.country !== 'all') filter.country = query.country;
  if (query.swot && query.swot !== 'all') filter.swot = query.swot;
  return filter;
};

// Route 1: Get all filter options for dropdowns
router.get('/filters', async (req, res) => {
  try {
    const endYears = await Data.distinct('end_year');
    const topics = await Data.distinct('topic');
    const sectors = await Data.distinct('sector');
    const regions = await Data.distinct('region');
    const pestles = await Data.distinct('pestle');
    const sources = await Data.distinct('source');
    const countries = await Data.distinct('country');
    const swots = await Data.distinct('swot');

    const clean = (arr) => arr.filter(v => v && v !== '').sort();
    
    res.json({
      success: true,
      filters: {
        endYears: clean(endYears),
        topics: clean(topics),
        sectors: clean(sectors),
        regions: clean(regions),
        pestles: clean(pestles),
        sources: clean(sources),
        countries: clean(countries),
        swots: clean(swots),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 2: Get stats (total, averages)
router.get('/stats', async (req, res) => {
  try {
    const filter = buildFilter(req.query);

    // Run aggregations concurrently to get real business metrics
    const [
      avgResult,
      distinctSectors,
      regionResult,
      countryResult,
      topicResult
    ] = await Promise.all([
      Data.aggregate([
        { $match: { ...filter, relevance: { $gt: 0 } } },
        { $group: { _id: null, avgRelevance: { $avg: '$relevance' } } }
      ]),
      Data.distinct('sector', { ...filter, sector: { $ne: '' } }),
      Data.aggregate([
        { $match: { ...filter, region: { $ne: '' } } },
        { $group: { _id: '$region', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]),
      Data.aggregate([
        { $match: { ...filter, country: { $ne: '' } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]),
      Data.aggregate([
        { $match: { ...filter, topic: { $ne: '' } } },
        { $group: { _id: '$topic', maxIntensity: { $max: '$intensity' } } },
        { $sort: { maxIntensity: -1 } },
        { $limit: 1 }
      ])
    ]);

    const topTopicRaw = topicResult[0] ? topicResult[0]._id : 'N/A';

    res.json({
      success: true,
      stats: {
        avgRelevance: avgResult[0] ? Math.round((avgResult[0].avgRelevance || 0) * 10) / 10 : 0,
        totalSectors: distinctSectors.length,
        dominantRegion: regionResult[0] ? regionResult[0]._id : 'N/A',
        activeCountry: countryResult[0] ? countryResult[0]._id : 'N/A',
        topTopic: topTopicRaw !== 'N/A' ? topTopicRaw.charAt(0).toUpperCase() + topTopicRaw.slice(1) : 'N/A',
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 3: Intensity by Topic
router.get('/intensity-by-topic', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.aggregate([
      { $match: { ...filter, topic: { $ne: '' }, intensity: { $gt: 0 } } },
      { $group: { _id: '$topic', avgIntensity: { $avg: '$intensity' }, count: { $sum: 1 } } },
      { $sort: { avgIntensity: -1 } },
      { $limit: 15 }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 4: Intensity by Region
router.get('/intensity-by-region', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.aggregate([
      { $match: { ...filter, region: { $ne: '' }, intensity: { $gt: 0 } } },
      { $group: { _id: '$region', avgIntensity: { $avg: '$intensity' }, avgLikelihood: { $avg: '$likelihood' }, count: { $sum: 1 } } },
      { $sort: { avgIntensity: -1 } }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 5: Data by Year
router.get('/by-year', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.aggregate([
      { $match: { ...filter, end_year: { $ne: '' } } },
      { $group: { _id: '$end_year', avgIntensity: { $avg: '$intensity' }, avgLikelihood: { $avg: '$likelihood' }, avgRelevance: { $avg: '$relevance' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 6: By Sector
router.get('/by-sector', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.aggregate([
      { $match: { ...filter, sector: { $ne: '' } } },
      { $group: { _id: '$sector', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 7: By Pestle
router.get('/by-pestle', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.aggregate([
      { $match: { ...filter, pestle: { $ne: '' } } },
      { $group: { _id: '$pestle', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 8: By Country
router.get('/by-country', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.aggregate([
      { $match: { ...filter, country: { $ne: '' } } },
      { $group: { _id: '$country', count: { $sum: 1 }, avgIntensity: { $avg: '$intensity' } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 9: By Source
router.get('/by-source', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.aggregate([
      { $match: { ...filter, source: { $ne: '' } } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 10: Likelihood vs Intensity (Scatter)
router.get('/likelihood-vs-intensity', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const result = await Data.find(
      { ...filter, intensity: { $gt: 0 }, likelihood: { $gt: 0 } },
      { intensity: 1, likelihood: 1, sector: 1, topic: 1, _id: 0 }
    ).limit(300);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
