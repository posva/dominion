#! /usr/bin/env python3
#
# Generate requirejs deps from a set of cards.
# ./gen-cards-deps.py ../js/cards/*.js
# /gen-cards-deps.py ../js/cards/* | js-beautify -s 2 -f -
# /gen-cards-deps.py ../js/cards/* | js-beautify -s 2 -f - > file.js
#define(['cards/copper', 'cards/curse', 'cards/duchy', 'cards/estate', 'cards/gold', 'cards/province', 'cards/silver'], function(Copper, CurseCard, Duchy, Estate, Gold, Province, Silver) {
#  return {
#    'silver': Silver,
#    'estate': Estate,
#    'curse': CurseCard,
#    'province': Province,
#    'duchy': Duchy,
#    'gold': Gold,
#    'copper': Copper
#  };
#});

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
obj = {} # dic name -> card
for f in sys.argv[1:]:
    try:
        ckey = nar.search(os.path.abspath(f)).group(1)
    except:
        print(f+' doesn\'t seem to be a card. It will be ignored', file=sys.stderr)
        continue
    cval = getReturn(f)

    names.append(cval)
    dep.append(ckey)
    obj[os.path.basename(ckey)] = cval

print('define(%s, function(%s) {'%(str(dep), str(names).replace('[', '').replace(']', '').replace("'", '')))
print('return', re.sub(r'\'([a-zA-Z_]+)\'([,}])', r'\1\2', str(obj)), '; });')
