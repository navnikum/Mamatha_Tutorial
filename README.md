# Spectra Redwood Starter Application

A starter application template for Fusion Apps - Redwood Stripe Starter Application pre-configured with the Redwood Stripe.
This Template is useful for creating starter applications to get familiar with Redwood.

With this template you can practice creating FA based projects as described in this tutorial:
https://confluence.oraclecorp.com/confluence/display/REX/For+Spectra+FA+Developers




## TUD for FA 

For FA production, you need to use your FA family application project instead of creating project from scratch using this template.
- Once Access to VBCS DT were granted you should familiarize yourself with the development environment. 
- To create new application, you can click on "New" button on top right side. Choose the name for the application.
- After that you can set the application template by doing "Choose Template". Choose "Fusion Apps - Redwood Stripe Starter Application" and click on Select.
- Now the project is being set with Spectra Redwood application pre-configured with the Redwood shell. If you will run the application, you can see the Redwood Shell getting loaded with default main page setup and latest Redwood Stripe pre-configured.
- When the application is created then you can hit "Preview" (on the top right section) to look at the preview.
- Some of the sevices required by the Redwood Shell is already pre-configured but would require setting up the basic auth: 
    -Go to Source View -> services -> catalog.json -> FA Instance for all services and click on Edit for "Default Server". A central instance is already preconfigured and add a standard username / password in the Authentication section and "Save".


You can find more information in the following TUD : https://confluence.oraclecorp.com/confluence/display/REX/For+Spectra+FA+Developers


### Instructions for Use

Visual Builder applications created from this template will have a component-palette that is pre-configured with components that are published in oj-sp Pack 

http://exchange.oraclecorp.com/ui/index.html?root=view&fullName=oj-sp


As new versions of the components are published you will receive notifications to upgrade the components.

### Help Links
There are more video tutorials available at :

https://docs.oracle.com/en/cloud/paas/app-builder-cloud/videos.html

As well as document based tutorials available at :

https://docs.oracle.com/en/cloud/paas/app-builder-cloud/tutorials.html

Another useful resource is series of VBCS related blogs available at:

https://blogs.oracle.com/vbcs/oracle-visual-builder-cloud-service-learning-path
