inductive NAT where
  | Z : NAT
  | S : NAT -> NAT

inductive The : NAT -> Type where
  | val : (x : NAT) -> The x

def add : NAT -> NAT -> NAT
  | a, NAT.S b => NAT.S (add a b)
  | a, NAT.Z   => a

def mul : NAT -> NAT -> NAT
  | a, NAT.S b => add a (mul a b)
  | _, NAT.Z   => NAT.Z

def exp : NAT -> NAT -> NAT
  | a, NAT.S b => mul a (exp a b)
  | _, NAT.Z   => NAT.S NAT.Z

def nul : NAT -> NAT
  | NAT.S a => nul a
  | NAT.Z   => NAT.Z
 
def work : The (nul (exp (NAT.S (NAT.S (NAT.S NAT.Z))) (NAT.S (NAT.S (NAT.S (NAT.S (NAT.S (NAT.S (NAT.S (NAT.S NAT.Z))))))))))
  := @The.val NAT.Z
