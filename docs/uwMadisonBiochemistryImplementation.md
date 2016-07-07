Example -- UW-Madison, Biochemistry Department
==============================================

## Introduction
Since the project originated from the Biochemistry department at UW-Madison, it only makes sense to have an example implementation on how we used BLT2 to ensure that packages delivered to the department are successfully delivered to their receivers.

## About the Biochemistry Department at UW-Madison
The Biochemistry department spans across four different buildings and is in the middle of the greater UW-Madison campus (including UW Health and School of Nursing). We have a little over 70 locations where packages could go to and receive about 50-60 packages a day from five to six different package carriers. 

## Equipment Used
1. Dell Optiplex 9020 AIO
    * Windows 10 Enterprise
    * Google Chrome 51+
2. [HoverCam Solo 8](http://www.thehovercam.com/store/hovercam-document-cameras/resellersolo8fix/hovercam-solo-8-detail)
    * Connected to Dell Optiplex 9020 AIO
3. Apple iPod Touch (6th gen)
    * iOS 9+
    * Opera Web Browser with Turbo turned off
4. [Socket Mobile CHS 8Ci](https://www.socketmobile.com/products/socketscan-800-series/overview/)
    * Paired to iPod Touch
5. CentOS Web Server
    * 25 MB max upload for multiple packing slips
6. Using the deployment/shipping.biochem.wisc.edu branch for Shibboleth (UW-Madison's NetID authentication)
    * Users in the database are the UW-Madison's NetID usernames 

## Differences between the master branch and the deployment/shipping.biochem.wisc.edu branch
1. deployment/shipping.biochem.wisc.edu uses Shibboleth authentication to authenticate users to BLT2 so it has the following changes:
    * It has a Shibboleth user class and a Shibboleth user provider class to help map valid Shibboleth users to User objects used by Symfony
    * Under app/config/security.yml, the settings are changed to use the Shibboleth user provider, added a firewall to disallow all unauthorized users to BLT2 and set the logout page to UW-Madison's logout route
    * Because Symfony is using User objects, all calls that retrieved the User object now also call the getUsername() function
        * In master, the User object is "anon." so getting the User object is just the plain text

## Daily Process
In conjunction with the Biochemistry department's purchasing system (BPS), BLT2 needs to keep a copy of the package's packing slip in order to validate orders.

### Receiving
1. Packages arrive at the shipping dock
2. For each package
    1. Open each package and search for the packing slip
    2. Navigate to /receiving and scan in the tracking number
    3. Fill in the form (who is the vendor, receiver, shipper, number of packages)
    4. Take a picture of the packing slip(s) using the HoverCam Solo 8
    5. Submit

### Delivering
1. Once all of the packages have arrived (no more shippers for the day), add them to a cart and prepare them for delivery
2. On the iPods, navigate to /delivering
3. For each receiver
    1. Scan in barcode of the receiver
    2. Scan in the tracking number of the package being delivered

### Office (for BPS)
1. Navigate to /view
2. Match packing slip(s) with order ID(s)
3. Upload packing slip(s) to BPS

### Pickup
BLT2 offers a way for users to pick up their packages down in the shipping dock.

1. Navigate to /receiving and click on Pickup
2. Scan in tracking number of the package being picked up
3. Enter in the name of who is picking up the package

## History
Before BLT/BLT2, employees in the shipping/receiving dock would manually make a photo copy of each packing slip, deliver packages without any confirmation that they had delivered the package, and the employees in the office would have to manually rescan in the copied packing slip(s) and upload them to BPS.

Now with BLT2, employees in the shipping/receiving dock would enter in information about the package, take a picture of the packing slip(s), deliver packages with confirmation that they delivered the package and employees in the office would visit BLT2 for copies of the packing slip(s).

While time is gained during the receiving and delivering of packages, the amount of time saved in the office and the assurance that packages are delivered to their receivers benefits greatly throughout the department. In total, BLT2 saved about 40-50 minutes a day thus cutting back on the number of hours needed for employees in the office needed to upload packing slips to BPS.  