import argparse
import roomrando

def _hex(val: int, size: int):
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

if __name__ == '__main__':
    '''
    Usage
    python address.py 0x049BEA1C
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('address', help='Input a hex address', type=str)
    parser.add_argument('type', help='Address type ("GAMEDATA" or "DISC")', type=str)
    args = parser.parse_args()
    address = roomrando.Address(int(args.address, 16), args.type)
    print('Game:', _hex(address.address, 8))
    print('Disc:', _hex(address.to_disc_address(), 8))