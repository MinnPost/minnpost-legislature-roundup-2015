import scraperwiki
import lxml.html
import re
import os
import urllib
import json

# Reads list of bills from then gets more info from Open States
# http://mn.gov/governor/resources/legislation/

# Be nice and don't steal
open_states_key = '1e1c9b31bf15440aacafe4125f221bf2'
os_bill_url = 'http://openstates.org/api/v1/bills/MN/2013-2014/%s/?apikey=%s'
os_leg_url = 'http://openstates.org/api/v1/legislators/%s/?apikey=%s'
gov_url = 'http://mn.gov/governor/resources/legislation/'
bills_list = []
leg_list = {}
script_path = os.path.dirname(os.path.realpath(__file__))
output_file = os.path.join(script_path, '../data/bills.json')

# Subject map
subject_map = {
  'Administration Department': 'Government',
  'Agriculture and Agriculture Department': 'Agriculture and Food',
  'Alcoholic Beverages': 'Health and Science',
  'Animals and Pets': 'Environment and Recreation',
  'Appropriations': 'Budget, Spending and Taxes',
  'Appropriations-Omnibus Bills': 'Budget, Spending and Taxes',
  'Arts': 'Arts and Humanities',
  'Banks and Financial Institutions': '',
  'Banks, Financial Institutions, and Credit Unions': '',
  'Bicycles and Bikeways': 'Transportation',
  'Boards': '',
  'Boats, Boating, and Watercraft': 'Transportation',
  'Bonds': 'Budget, Spending and Taxes',
  'Builders and Building Contractors': '',
  'Buildings and Building Codes': '',
  'Business': 'Business and Economy',
  'Chemical Dependency': 'Crime and Drugs',
  'Children and Families': 'Social Issues',
  'Children and Minors': 'Social Issues',
  'Children-Child Care and Facilities': 'Social Issues',
  'Children-Custody and Support': 'Social Issues',
  'Cities and Towns': 'Government',
  'Cities and Towns-Specific': 'Government',
  'Claims': 'Legal',
  'Commerce Department': 'Business and Economy',
  'Commerce and Commerce Department': 'Business and Economy',
  'Commissions': 'Government',
  'Committees and Working Groups': 'Government',
  'Constitutional Amendments': 'Government',
  'Constitutional Offices': 'Government',
  'Consumer Protection': 'Business and Economy',
  'Contracts': 'Legal',
  'Cooperatives': 'Business and Economy',
  'Corrections and Corrections Department': 'Crime and Drugs',
  'Corrections-Juveniles': 'Crime and Drugs',
  'Councils': 'Government',
  'Counties': 'Government',
  'Counties-Specific': 'Government',
  'Courts': 'Legal',
  'Courts-Specific': '',
  'Credit and Credit Services': 'Business and Economy',
  'Crime Victims': 'Crime and Drugs',
  'Crimes and Criminals': 'Crime and Drugs',
  'Crimes and Criminals-Sexual Offenses': 'Crime and Drugs',
  'Crimes and Criminals-Victims': 'Crime and Drugs',
  'Data Practices and Privacy': '',
  'Death': 'Social Issues',
  'Death, Funerals, and Cemeteries': 'Social Issues',
  'Disabilities and Access': 'Health and Science',
  'Disasters': 'Environment and Recreation',
  'Drivers\' Licenses, Training, and ID Cards': 'Government',
  'Drugs and Medicine': 'Health and Science',
  'Easements and Conveyances': 'Housing and Property',
  'Economic Development': 'Business and Economy',
  'Education and Education Department': 'Education',
  'Education-Higher': 'Education',
  'Education-K-12': 'Education',
  'Education-Pre-Kindergarten-12': 'Education',
  'Education-School Districts': 'Education',
  'Elections': 'Campaign Finance and Election Issues',
  'Emergency and 911 Services': '',
  'Employee Relations Department': '',
  'Employment and Economic Development Department': 'Business and Economy',
  'Energy': 'Energy and Technology',
  'Environment': 'Environment and Recreation',
  'Ethics': '',
  'Family': 'Social Issues',
  'Fire and Firefighters': '',
  'Firearms and Dangerous Weapons': 'Guns',
  'Fish and Fishing': 'Environment and Recreation',
  'Forests and Trees': 'Environment and Recreation',
  'Fuels': 'Energy and Technology',
  'Funerals and Cemeteries': 'Social Issues',
  'Gambling': 'Gambling and Gaming',
  'Gambling and Lottery': 'Gambling and Gaming',
  'Government-Employees': 'Government',
  'Government-Federal': 'Government',
  'Government-Local': 'Government',
  'Government-State': 'Government',
  'Governmental Operations-Federal': 'Government',
  'Governmental Operations-Local': 'Government',
  'Governmental Operations-State': 'Government',
  'Guardians and Conservators': 'Social Issues',
  'Hazardous Substances': 'Environment and Recreation',
  'Health and Health Department': 'Health and Science',
  'Health-Mental Health': 'Health and Science',
  'Highways, Roads, and Bridges': 'Transportation',
  'Historic Sites and Historical Societies': '',
  'Hospitals and Health Care Facilities': 'Health and Science',
  'Hospitals and Health Facilities': 'Health and Science',
  'Housing and Housing Finance Agency': 'Housing and Property',
  'Human Rights and Human Rights Department': 'Social Issues',
  'Human Services and Human Services Department': '',
  'Hunting and Game': 'Environment and Recreation',
  'Immigrants and Aliens': 'Immigration',
  'Insurance': 'Insurance',
  'Insurance-Health': 'Insurance',
  'Insurance-Property and Casualty': 'Insurance',
  'International Relations': '',
  'Interstate Compacts and Agreements': '',
  'Judges': 'Legal',
  'Labor, Employment, and Labor and Industry Department': 'Business and Economy',
  'Lakes, Ponds, Rivers, and Streams': 'Environment and Recreation',
  'Landlords and Tenants': 'Housing and Property',
  'Lands': 'Housing and Property',
  'Lands-State': 'Housing and Property',
  'Law Enforcement': 'Crime and Drugs',
  'Legal Proceedings': 'Legal',
  'Legislature': 'Government',
  'Liability': 'Legal',
  'Licenses': '',
  'Liquor': 'Social Issues',
  'Marriage and Marriage Dissolution': 'Social Issues',
  'Metropolitan Area': '',
  'Military and Military Affairs Department': '',
  'Mines and Mining': 'Environment and Recreation',
  'Minnesota Management and Budget Department': '',
  'Minnesota State Colleges and Universities': 'Education',
  'Minorities and Protected Groups': '',
  'Mortgages and Deeds': 'Housing and Property',
  'Motor Vehicles': 'Transportation',
  'Motor Vehicles-Carriers': 'Transportation',
  'Motor Vehicles-Motorcycles, Snowmobiles, and ATVs': 'Transportation',
  'Motor Vehicles-Registration, Licensing, and Taxation': 'Transportation',
  'Motorcycles, Snowmobiles, and ATVs': 'Transportation',
  'Museums and Theaters': 'Arts and Humanities',
  'Native Americans': 'Social Issues',
  'Natural Resources Department': 'Environment and Recreation',
  'Natural Resources and Natural Resources Department': 'Environment and Recreation',
  'Nonprofit and Charitable Organizations': '',
  'Nursing Homes and Care Facilities': 'Health and Science',
  'Occupations and Professions': '',
  'Omnibus Bills': 'Budget, Spending and Taxes',
  'Parks and Trails': 'Environment and Recreation',
  'Pets': '',
  'Plants, Seeds, and Nurseries': 'Environment and Recreation',
  'Police and Peace Officers': 'Crime and Drugs',
  'Pollution and Pollution Control Agency': 'Environment and Recreation',
  'Popular Names': '',
  'Public Safety Department': 'Crime and Drugs',
  'Public Utilities and Public Utilities Commission': '',
  'Public and State Employees': 'Government',
  'Railroads': 'Transportation',
  'Real Estate': 'Housing and Property',
  'Reapportionment and Redistricting': '',
  'Religion and Religious Beliefs': 'Social Issues',
  'Resolutions': '',
  'Retirement': 'Social Issues',
  'Retirement-Public and State Employees': 'Government',
  'Safety': 'Crime and Drugs',
  'Securities': '',
  'Sewers and Septic Systems': '',
  'State Agencies and Departments': 'Government',
  'State Boards': 'Government',
  'State Councils and Commissions': 'Government',
  'State Officials': 'Government',
  'Statutes': 'Government',
  'Students': 'Education',
  'Taxation': 'Budget, Spending and Taxes',
  'Taxation-Income': 'Budget, Spending and Taxes',
  'Taxation-Property': 'Budget, Spending and Taxes',
  'Taxation-Sales and Use': 'Budget, Spending and Taxes',
  'Teachers': 'Education',
  'Telecommunications and Information Technology': 'Energy and Technology',
  'Television and Radio': '',
  'Tobacco Products': 'Social Issues',
  'Trade Practices': 'Business and Economy',
  'Traffic Regulations': 'Transportation',
  'Transportation and Transportation Department': 'Transportation',
  'Trusts': '',
  'Unemployment Insurance': 'Insurance',
  'Uniform Acts': '',
  'Uniform Commercial Code': '',
  'University of Minnesota': 'Education',
  'Veterans and Veterans Affairs Department': '',
  'Wages': 'Business and Economy',
  'Waste and Waste Management': '',
  'Water, Water Resources, and Waterways': '',
  'Waters-Lakes': 'Environment and Recreation',
  'Waters-Rivers': 'Environment and Recreation',
  'Watershed Districts': 'Environment and Recreation',
  'Weights and Measures': '',
  'Women': 'Social Issues',
  'Workers Compensation': 'Business and Economy',
  'Zoos': ''
}


# Get list of pages to scrape
def get_next(root):
  found = False

  for a in root.cssselect('#content_leftblock_nav_705 a'):
    if a.text_content() == 'Next':
      found = gov_url + a.attrib['href']

  return found


# Get votes
def get_votes(data):
  vote_action_re = re.compile('(passed)(.*)(vote)(.*[^0-9])([0-9]+\-[0-9]+)', re.I | re.M | re.S)
  url = 'https://www.revisor.mn.gov/bills/bill.php?b=' + urllib.quote_plus(data['chamber']) + '&f=' + urllib.quote_plus(data['bill']) + '&ssn=0&y=2013'
  html = scraperwiki.scrape(url)
  root = lxml.html.fromstring(html)

  # House votes
  for tr in root.cssselect('.house table.actions tr'):
    if vote_action_re.search(tr[1].text_content()):
      data['house_vote'] = vote_action_re.search(tr[1].text_content()).groups()[4]
      data['house_ayes'] = int(data['house_vote'].split('-')[0])
      data['house_nays'] = int(data['house_vote'].split('-')[1])

  # Senate votes
  for tr in root.cssselect('.senate table.actions tr'):
    if vote_action_re.search(tr[1].text_content()):
      data['senate_vote'] = vote_action_re.search(tr[1].text_content()).groups()[4]
      data['senate_ayes'] = int(data['senate_vote'].split('-')[0])
      data['senate_nays'] = int(data['senate_vote'].split('-')[1])

  return data


# Turn into standardized categories
def make_categories(input_categories):
  standardized = []

  for c in input_categories:
    s = subject_map[c] if c in subject_map else ''

    if s not in ['', None] and s not in standardized:
      standardized.append(s)

  return standardized


# Get leg data from OS
def get_leg(leg_id):
  if leg_id in leg_list:
    return leg_list[leg_id]

  try:
    url = os_leg_url % (urllib.quote(leg_id), open_states_key)
    os_data = json.loads(scraperwiki.scrape(url))
  except e:
    print url
    print os_data
    print e

  # Not good but how it was originally
  #leg_list[leg_id] = {
  #  'full_name': os_data['full_name'],
  #  'party': os_data['party'] if 'party' in os_data else None,
  #  'photo_url': os_data['photo_url'] if 'photo_url' in os_data else None,
  #  'url': os_data['url'] if 'url' in os_data else None,
  #}
  leg_list[leg_id] = []
  leg_list[leg_id].append(os_data['full_name'])
  leg_list[leg_id].append(os_data['party'] if 'party' in os_data else None)
  leg_list[leg_id].append(os_data['photo_url'] if 'photo_url' in os_data else None)
  leg_list[leg_id].append(os_data['url'] if 'url' in os_data else None)

  return leg_list[leg_id]



# Get OS bill data
def get_os_bill(data):
  try:
    url = os_bill_url % (urllib.quote(data['bill']), open_states_key)
    os_data = json.loads(scraperwiki.scrape(url))
  except Exception as e:
    print url
    print data
    print e

  data['title'] = os_data['title']
  data['billurl'] = os_data['sources'][0]['url']
  data['end_date'] = os_data['action_dates']['last']

  # Get introduced data
  for a in os_data['actions']:
    if a['type'][0] == 'bill:introduced':
      data['start_date'] = a['date']

  # Categories
  data['categories'] = make_categories(os_data['+scraped_subjects'])

  # Sponsors
  data['house_sponsors'] = []
  data['senate_sponsors'] = []
  for s in os_data['sponsors']:
    leg = get_leg(s['leg_id'])
    if s['chamber'] == 'upper':
      data['senate_sponsors'].append(leg)
    if s['chamber'] == 'lower':
      data['house_sponsors'].append(leg)

  return data


# Get data from governor's page
def scrape_governor_page(url):
  html = scraperwiki.scrape(url)
  root = lxml.html.fromstring(html)

  next_found = get_next(root)

  # Chapter  House File  Senate File  Description  Presented  Signed  Vetoed  Filed w/o Signature
  for tr in root.cssselect('table.table_legislation tbody tr'):
    # Ensure that we have a number
    if tr[1].text_content() in ['', None] and tr[2].text_content() in ['', None]:
      continue

    # Look for house or senate
    if tr[1].text_content():
      bill = 'HF ' + tr[1].text_content()
      chamber = 'house'
    else:
      bill = 'SF ' + tr[2].text_content()
      chamber = 'senate'

    # For some reason, data is missing or wrong
    if tr[0].text_content().strip() == '18' and tr[4].text_content().strip() == '4/19/13':
      bill = 'HF 75'
      chamber = 'house'
    if bill == 'HF 340':
      bill = 'SF 340'
      chamber = 'senate'
    bill = bill.rstrip('AaBbCcDdEeFf')

    # Check if veto has link
    veto_link = ''
    for a in tr[6].cssselect('a'):
      veto_link = gov_url + a.attrib['href']

    data = {
      'chapter': tr[0].text_content().strip(),
      'chamber': chamber,
      'bill': bill,
      'description': tr[3].text_content().strip(),
      'presented': tr[4].text_content().strip(),
      'signed': bool(tr[5].text_content().strip() != '-' or not tr[6].text_content().strip()),
      'vetoed': bool(tr[6].text_content().strip() != '-' or not tr[6].text_content().strip()),
      'signed_no_signature': bool(tr[7].text_content().strip() != '-' or not tr[7].text_content().strip()),
      'veto_link': veto_link
    }
    data['bill_status'] = 'vetoed' if data['vetoed'] and data['veto_link'] in [None, [], ''] else 'signed'
    data['bill_status'] = 'partially vetoed' if data['vetoed'] and not data['veto_link'] in [None, [], ''] else 'signed'

    data = get_votes(data)
    data = get_os_bill(data)
    bills_list.append(data)

  return next_found


# Save data
def save_data():
  print json.dumps(bills_list, sort_keys = True, indent = 2)

  with open(output_file, 'w') as out:
    json.dump(bills_list, out)


# Main execution
current = gov_url

while (current):
  print 'Scraping: ' + current
  current = scrape_governor_page(current)

save_data()
