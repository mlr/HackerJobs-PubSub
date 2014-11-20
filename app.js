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

app.get('/', function(req, res) {
	res.type('text/plain');
	var url = 'http://jobs.smashingmagazine.com/all/programming';
	var jobs = {};

	request(url, function(err, resp, html) {
		if(!err) {
			var $ = cheerio.load(html);
			var titles = [];
			var engagements = [];
			var locations = [];
			var links = [];
			$('article.entry h2').each(function(i) {
				titles.push({'title': $(this).text()});
			});
			$('article.entry .entry-type').each(function(i) {
				engagements.push({'engagement': $(this).text()});
			});
			$('article.entry .entry-company').each(function(i) {
				locations.push({'location': $(this).text()});
			});
			$('.entry-list li a').each(function(i) {
				links.push({'link': $(this).attr('href')});
			});
			jobs = _.zip(titles, engagements, locations, links);
		}
		res.json(jobs);
		res.end();
	});
});

app.listen(9999);