#! /usr/bin/env python3
#
# Generate requirejs deps from a set of cards.
# Place yourself in the directory where are the cards. For example in js/cards
# where the base cards (copper, curse) are. Then launch the script:
# ../../script/genCardsDeps.py *.js
# -> define(['cards/copper', 'cards/curse', 'cards/duchy', 'cards/estate', 'cards/gold', 'cards/province', 'cards/silver'], function(Copper, Curse, Duchy, Estate, Gold, Province, Silver) {

import getopt, sys, time, os, re

def getReturn(fi):
    f = open(fi, 'U')
    ret = re.compile('\s*return\s*([a-zA-Z_]+)')
    for l in f:
        found = ret.search(l)
        if found:
            f.close()
            return found.group(1)
    print('ERROR: couldn\'t find a class for', fi, '. Please use a simple return statement: return ClassName;')
    f.close()


dep = [] # define(['cards/copper',...],
names = [] # function(Copper, ...) {
nar = re.compile('js/(.*)\.js')
for f in sys.argv[1:]:
    names.append(getReturn(f))
    dep.append(nar.search(os.path.abspath(f)).group(1))
print('define(%s, function(%s) {'%(str(dep), str(names).replace('[',
'').replace(']', '').replace("'", '')))
