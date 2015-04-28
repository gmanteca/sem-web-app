import tornado.web
import tornado.ioloop
import requests
import json
from tornado.web import RequestHandler, Application
from tornado.ioloop import IOLoop

#IOLoop instance singleton

ioloop = IOLoop.instance()

#Handlers
class MainHandler(RequestHandler):
    def get(self):
        #TODO
        pass

class ProxyHandler(RequestHandler):
    def get(self):
        #TODO get params and proxy it to SPARQL
        pass

    def post(self):
        #TODO get params and proxy to SPARQL
        pass
    def setHeaders(self):
        self.getset_header("Access-Control-Allow-Origin","*")
        self.getset_header("Content-Type", "application/json")

#Application Initialization

app = Application([
    ("/",MainHandler),
    ("/sparql",ProxyHandler),
    ],
    debug=True)

if __name__ == "__main__":
    app.listen(81)

    try:
        ioloop.start()
    except KeyboardInterrupt:
        print("\n\n**Finishing server**\n\n")
        
