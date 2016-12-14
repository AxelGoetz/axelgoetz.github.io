---
project_id: hackathon-live-feed
title: Hackaton Live Feed
github_link: https://github.com/AxelGoetz/hackathon-live-feed
demo_link: https://hlf.agoetz.me/
---

<iframe src="https://hlf.agoetz.me" style="width: 100%; height: 70%; align: center;"></iframe>
<div style="font-weight: italic;">It might take a while to load the page above since its currently hosted on a free plan</div>

[Hackathon Live Feed](https://hlf.agoetz.me) is a web application that can be used during events to display the schedule, live tweets and custom messages.
The main reason why we developed is because while I was part of the committee at [techsoc](http://techsoc.io), we organised the [Microsoft Data Science Student Challenge](http://www.cs.ucl.ac.uk/computer_science_news/article/ucls-data-science-hackathon-is-the-first-of-its-kind-in-the-uk/) (DSSC) and we realised we needed a way to quickly communicate with all of the attendees.

A live feed seemed like a good decision but it needed to support live updates because the webpage might be open throughout the entire event without being reloaded. Therefore this prototype had an admin section where the organisers can change something and immediately push the changes using websockets to all attendees.

After DSSC, this live feed was also used for [HackLondon 2016](https://hacklondon.org/).
