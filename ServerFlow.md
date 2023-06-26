# How the server distribute changes?

There is one central server with ordered changes.

When a client initiates a change it sends to the server. The server either accepts it and assign an ordered id for it, or reject it with a reason (eg. conflict, lack of permissions). If the change is accepted it sends to all active clients. If there is no active connection to the server, the client saves the change to the "pending changes" list.

When a client receives a change, it checks wheter it's id is continous. If so, just register the change an update the local store accordingly. If it is not continous it fetches the server for the missing changes.

Locally there should be list of all of the accepted changes, and a list of the pending changes.
