# -*- coding: utf-8 -*-
from numpy import *
import time
import matplotlib.pyplot as plt

def loadDataSet():
    file = open("aprioriDataSet.txt",'r')
    dataSet = []
    for line in file:
        indexStart = line.find('{')
        indexEnd = line.find('}')
        line = line[indexStart+1:indexEnd]
        line = line.split(',')
        dataSet.append(line)
    return dataSet


def createC1(dataSet):
    C1 = []
    for transaction in dataSet:
        for item in transaction:
            if not [item] in C1:
                C1.append([item])
    C1.sort()
    return map(frozenset, C1)


def scanD(D, Ck, minSupport):
    ssCnt = {}
    for tid in D:
        for can in Ck:
            if can.issubset(tid):
                if can not in ssCnt.keys(): ssCnt[can]=1
                else: ssCnt[can] += 1
    numItems = float(len(D))
    retList = []
    supportData = {}
    for key in ssCnt:
        support = ssCnt[key]/numItems
        if support >= minSupport:
            retList.insert(0,key)
        supportData[key] = support
    return retList, supportData


def aprioriGen(Lk, k):
    retList = []
    lenLk = len(Lk)
    for i in range(lenLk):
        for j in range(i+1, lenLk):
            L1 = list(Lk[i])[:k-2]; L2 = list(Lk[j])[:k-2]
            L1.sort(); L2.sort()
            if L1==L2:
                retList.append(Lk[i] | Lk[j])
    return retList


def apriori(dataSet, minSupport):
    C1 = createC1(dataSet)
    D = list(map(set, dataSet))
    L1, supportData = scanD(D, C1, minSupport)
    L = [L1]
    k = 2
    while (len(L[k-2]) > 0):
        Ck = aprioriGen(L[k-2], k)
        Lk, supK = scanD(D, Ck, minSupport)
        supportData.update(supK)
        L.append(Lk)
        k += 1
    return L, supportData


supports = [0.01,0.02,0.03,0.04]
runTime = []
dataSet = loadDataSet()
for support in supports:
    start = time.process_time()
    L,suppData = apriori(dataSet,support)
    end = time.process_time()
    runTime.append(round(end-start,2))

plt.subplot(1,2,1)
plt.plot(supports,runTime,marker='o')
plt.title('Apriori RunTime in different support')
plt.xlabel('support')
plt.ylabel('RunTime')

lines = [2000,4000,6000,8000,9000]
runTimeLine = []
for line in lines:
    start = time.process_time()
    L,suppData = apriori(dataSet[:line+1],0.04)
    end = time.process_time()
    runTimeLine.append(round(end-start,2))

plt.subplot(1,2,2)
plt.plot(lines,runTimeLine,marker='o')
plt.title('Apriori RunTime in different dataLine')
plt.xlabel('dataLine')
plt.ylabel('RunTime')

plt.show()
