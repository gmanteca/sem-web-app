import tornado.web
import tornado.ioloop
import requests
import json
from tornado.web import RequestHandler, Application
from tornado.ioloop import IOLoop

#IOLoop instance singleton

ioloop = IOLoop.instance()

class ClassificationStatus(object):
    def __init__(self):
        self.terms = {}
        self.stopWords = []
        self.punctuation = []
    def LoadTerms(self,filename):
        with open(filename,"r") as f:
            for line in f:
                line = line.strip().split("\t")
                self.terms[line[0]]=line[1]
    def LoadStopWords(self,filename):
        with open(filename,"r") as f:
            for line in f:
                line = line.split("|")[0].strip()
                if line:
                    self.stopWords.append(line)
    def LoadPunctuation(self,filename):
        with open(filename,"r") as f:
            for line in f:
                self.punctuation.append(line.strip())
                
status = ClassificationStatus()

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

#Twitter classification handler
class ClassificationHandler(RequestHandler):
    def post(self):
        body=json.loads(self.request.body.decode())
        if 'text' not in body:
            self.setHeaders()
            self.set_status(400)
            self.finish()
            return
        acum = 0
        words = 0
        text = self.cleanText(body['text'])
        wc = self.WordCount(text)
        for word in wc:
            if word in status.terms:
                acum += status.terms[word]*wc[word]
                words += wc[word]
        result={}
        value = 'Male' if acum/words>0 else 'Female'
        result['value']=value
        result['trust']=acum/words
        self.setHeaders()
        self.write(json.loads(result.encode()))
        self.set_status(200)
        
    def cleanText(self,text):
        for sign in status.punctuation:
            text = text.replace(word,"")
        text = ' '.join([word for word in text.split() \
                         if word not in status.stopWords])
        return text
        
    def WordCount(self, text):
        result = {}
        for word in text.split():
            if word not in result:
                result[word] = 1
            else:
                result[word] += 1
        return result

    def setHeaders(self):
        self.getset_header("Access-Control-Allow-Origin","*")
        self.getset_header("Content-Type", "application/json")
#Application Initialization

app = Application([
    ("/",MainHandler),
    ("/sparql",ProxyHandler),
    ("/classify",ClassificationHandler),
    ],
    debug=True)

if __name__ == "__main__":
    app.listen(8080)

    import argparse
    
    parser = argparse.ArgumentParser(description="Backend for SemWeb")
    parser.add_argument("-t","--termsfile",type=str,dest="termsfile",default="")
    parser.add_argument("-s","--stopfile",type=str,dest="stopfile")
    parser.add_argument("-pf","--punctuationfile",type=str,dest="punctuationfile")
    args = parser.parse_args()
    try:
        #loadTerms
        print("loading data...")
        status.LoadTerms(args.termsfile)
        status.LoadStopWords(args.stopfile)
        status.LoadPunctuation(args.punctuationfile)
        print("load complete! starting server...")
        ioloop.start()
        print("server started")
    except KeyboardInterrupt:
        print("\n\n**Finishing server**\n\n")
        
