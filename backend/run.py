from gevent.pywsgi import WSGIServer
from app import create_app

# Creating and running a Flask application

if __name__ == '__main__':
  app = create_app()
  http_server = WSGIServer(("0.0.0.0", 80), app)
  print("Staring application ...")
  http_server.serve_forever()
