//Main app file for HackerJobs PubSub
//Scott Hasbrouck <hello@scotthasbrouck> (C) 2014
//License CC0

'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
var app = express();

//JSON of scrape sites with elements
var scrapes = [
	{
		'url': 'http://jobs.smashingmagazine.com/all/programming',
		'titles': 'article.entry h2',
		'engagements': 'article.entry .entry-type',
		'locations': 'article.entry .entry-company',
		'company': '',
		'links': 'entry-list li a',
		'linkprefix': '',
		'timeout': 300,
		'pageindex': '',
		'maxpage': ''
	},
	{
		'url': 'https://news.ycombinator.com/jobs',
		'titles': '.title a',
		'engagements': '',
		'locations': '.title .comhead',
		'company': '',
		'links': '.title a',
		'linkprefix': '',
		'timeout': 300,
		'pageindex': '',
		'maxpage': ''
	},
	{
		'url': 'http://careers.stackoverflow.com/jobs',
		'titles': '.-title a',
		'engagements': '',
		'locations': '.-employer',
		'company': '',
		'links': '.-title a',
		'linkprefix': 'http://careers.stackoverflow.com',
		'timeout': 300,
		'pageindex': 'pg',
		'maxpage': '9'
	},
	{
		'url': 'https://jobs.github.com/positions',
		'titles': '.title a',
		'engagements': '',
		'locations': 'span.location',
		'company': '.company',
		'links': 'h4 a',
		'linkprefix': 'https://jobs.github.com',
		'timeout': 300,
		'pageindex': '',
		'maxpage': ''
	}
];

app.get('/', function(req, res) {
	res.type('text/plain');
	var jobs = [];
	var siteindex = 3;

	request(scrapes[siteindex]['url'], function(err, resp, html) {
		if(!err) {
			var $ = cheerio.load(html);
			var titles = [];
			var engagements = [];
			var locations = [];
			var links = [];
			$(scrapes[siteindex]['titles']).each(function(i) {
				titles.push({'title': $(this).text()});
			});
			$(scrapes[siteindex]['engagements']).each(function(i) {
				engagements.push({'engagement': $(this).text()});
			});
			$(scrapes[siteindex]['locations']).each(function(i) {
				locations.push({'location': $(this).text()});
			});
			$(scrapes[siteindex]['links']).each(function(i) {
				links.push({'link': scrapes[siteindex]['linkprefix'] + $(this).attr('href')});
			});
			jobs = jobs.concat(_.zip(titles, engagements, locations, links));
		}
		res.json(jobs);
		res.end();
	});
});

app.listen(9999);