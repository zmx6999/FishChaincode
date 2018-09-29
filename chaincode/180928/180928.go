package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
	"errors"
	"fmt"
	"time"
	"encoding/json"
)

type FishChaincode struct {

}

type Fish struct {
	Id string `json:"id"`
	Vessel string `json:"vessel"`
	Location string `json:"location"`
	Timestamp int64 `json:"timestamp"`
	Holder string `json:"holder"`
}

func (fc *FishChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (fc *FishChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn,args:=stub.GetFunctionAndParameters()
	if fn=="recordFish" {
		return fc.recordFish(stub,args)
	} else if fn=="queryFish" {
		return fc.queryFish(stub,args)
	} else if fn=="queryFishByRange" {
		return fc.queryFishByRange(stub,args)
	} else if fn=="transferFish" {
		return fc.transferFish(stub,args)
	}
	return shim.Error("")
}

func (fc *FishChaincode) recordFish(stub shim.ChaincodeStubInterface,args []string) peer.Response {
	err:=checkArgsNum(args,4)
	if err!=nil {
		return shim.Error(err.Error())
	}

	id:=args[0]
	fb,err:=stub.GetState(id)
	if err!=nil {
		return shim.Error(err.Error())
	}
	if fb!=nil {
		return shim.Error("fish exist")
	}

	vessel:=args[1]
	location:=args[2]
	timestamp:=time.Now().Unix()
	holder:=args[3]
	fish:=Fish{id,vessel,location,timestamp,holder}
	fb,err=json.Marshal(fish)
	if err!=nil {
		return shim.Error(err.Error())
	}
	err=stub.PutState(id,fb)
	if err!=nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func (fc *FishChaincode) queryFish(stub shim.ChaincodeStubInterface,args []string) peer.Response {
	err:=checkArgsNum(args,1)
	if err!=nil {
		return shim.Error(err.Error())
	}

	id:=args[0]
	fb,err:=stub.GetState(id)
	if err!=nil {
		return shim.Error(err.Error())
	}
	if fb==nil {
		return shim.Error("fish not exist")
	}
	return shim.Success(fb)
}

func (fc *FishChaincode) queryFishByRange(stub shim.ChaincodeStubInterface,args []string) peer.Response {
	err:=checkArgsNum(args,2)
	if err!=nil {
		return shim.Error(err.Error())
	}

	start:=args[0]
	end:=args[1]
	iter,err:=stub.GetStateByRange(start,end)
	if err!=nil {
		return shim.Error(err.Error())
	}
	defer iter.Close()

	fishes:=[]Fish{}
	for iter.HasNext() {
		item,err:=iter.Next()
		if err!=nil {
			return shim.Error(err.Error())
		}

		fish:=Fish{}
		err=json.Unmarshal(item.Value,&fish)
		if err!=nil {
			return shim.Error(err.Error())
		}

		fishes=append(fishes,fish)
	}
	fb,err:=json.Marshal(fishes)
	if err!=nil {
		return shim.Error(err.Error())
	}
	return shim.Success(fb)
}

func (fc *FishChaincode) transferFish(stub shim.ChaincodeStubInterface,args []string) peer.Response {
	err:=checkArgsNum(args,2)
	if err!=nil {
		return shim.Error(err.Error())
	}

	id:=args[0]
	fb,err:=stub.GetState(id)
	if err!=nil {
		return shim.Error(err.Error())
	}
	if fb==nil {
		return shim.Error("fish not exist")
	}

	fish:=Fish{}
	err=json.Unmarshal(fb,&fish)
	if err!=nil {
		return shim.Error(err.Error())
	}
	newholder:=args[1]
	fish.Holder=newholder
	fb,err=json.Marshal(fish)
	if err!=nil {
		return shim.Error(err.Error())
	}
	err=stub.PutState(id,fb)
	if err!=nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func main()  {
	shim.Start(new(FishChaincode))
}

func checkArgsNum(args []string,n int) error {
	if len(args)!=n {
		return errors.New(fmt.Sprintf("%d argument(s) required",n))
	}
	return nil
}