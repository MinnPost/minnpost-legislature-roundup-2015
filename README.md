Minnesota state legislative roundup.  The goal of this project is to create a visualization that explores the bills of the MN State Legislative Session 89 (2015).

This application is based on previous versions:

 - [2014](https://github.com/MinnPost/minnpost-legislature-roundup-2014)
 - [2013](https://github.com/MinnPost/minnpost-legislature-roundup-2013)
 - [2012](https://github.com/MinnPost/minnpost-legislature-roundup-2012)

## Data

* Bills are listed on the [Governor's site](http://mn.gov/governor/resources/legislation/).
* [Open States API](http://sunlightlabs.github.io/openstates-api/).
* MN Revisor

## Data Processing

Scraper can be run with the following.  It will write to `data/bills.json`.

    `python data-processing/gov-bill-scraper.py`

## Install

1. `bower install`
1. `npm install`

## Application

Go to `index-src.html` in a browser.

## Build and Deploy

1. Install `grunt`
1. To build, run: `grunt`
1. To deploy, run: `grunt mp-deploy`
