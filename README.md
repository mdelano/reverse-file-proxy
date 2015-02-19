# MediaSilo File Proxy Server

This server can convert image and document files. It can convert encoding as well as size and aspect ratio for images.

## Usage

The server will proxy images (/images) and documents (/documents). Each resource expects query parameters to determine what conversion will take place.

#### Convert Images

* type  : The target image encoding
* url   : url to the image you want to convert
* w     : The width of the image output
* h     : The height of the image output

```
/image/[type]?url=[url]&w=[w]&h=[h]
```

Here's an example that converts the google logo to a jpg:

```
http://localhost:8080/image/jpg?w=100&h=100&url=https://www.google.com/images/srpr/logo11w.png
```

#### Convert Documents

* type  : The target document encoding
* url   : url to the document you want to convert

```
/document/[type]?url=[url]
```

## Development
There are lots of system dependencies required for running this code. So, to avoid dirtying up your system, we use [Vagrant](http://docs.vagrantup.com/v2/getting-started/index.html). Vagrant allows us to install the system dependencies on a VM while doing our development locally. It's pretty slick.

To get your local environment up and running do this from the project root:

```
$ vagrant up
```

Then check out an asset in your browser:

```
http://localhost:8080/image/jpg?url=https://www.google.com/images/srpr/logo11w.png&h=100&w=100
```

## Deployment

The project contains a deployment directory which contains a fab file as well as a couple deployment dependencies. The deployment is build on AWS and uses the AWS SDK to create and deploy to instances. Each instance is automatically added to an ELB configured in the fab file as:

```env.elb_name = "preview-cluster-prod"```

#### Creating a New Instance

To create a new instance use the following fab command:

```
# fab <ENVIRONMENT> create_host
$ fab prob create_host
```
The above command will create a new host, deploy the app, add the host to the ELB, and tag the server with "prod" so that it can be identified later

#### Deploying to the Entire Cluster

You can deploy code to all nodes in the ELB by running the following fab command:
```
# fab <ENVIRONMENT> deploy
$ fab prod cluster deploy
```

The above command will deploy the latest master branch in github to each server in the prod ELB
