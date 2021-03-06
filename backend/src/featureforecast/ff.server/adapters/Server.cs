﻿using System;
using ff.service;

namespace ff.server.adapters
{
    class Server {
        public Server(IRequestHandler requestHandler) {
            RESTControllerV1.__RequestHandler = () => requestHandler;
        }

        public void Run(Uri address) {
            servicehost.ServiceHost.Run(address, new[]{typeof(RESTControllerV1)});
        }
    }
}