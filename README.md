angular-anydialog
=================

This is alpha, so just a super crude tutorial.

To install via bower
--------------------

    $ bower install angular-anydialog

To develop or launch examples
-----------------------------

    $ git clone https://github.com/karolmajta/angular-anydialog.git
    $ cd angular-anydialog
    $ nvm use
    $ npm install --devDependencies
    $ $(npm bin)/bower install
    $ $(npm bin)/grunt              # this will build project an run file watcher

I did not add a http server to gruntfile yet, but if you're on *NIX:

    $ python -m SimpleHTTPServer

Then in your browser go to `http://localhost:8000/examples/` and choose the
one you want.