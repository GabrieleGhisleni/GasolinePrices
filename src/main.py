from data_fetch import *
from data_process import *
import datetime as dt
import argparse


def main():
    def time_(): return dt.datetime.now().strftime("%S:%M %d-%m-%Y")
    arg_parse = argparse.ArgumentParser(description='Argument for GitHub Actions')
    arg_parse.add_argument('-n', '--new', action='store_true')
    arg_parse.add_argument('-d', '--default', action='store_true')
    args = arg_parse.parse_args()

    if args.default:
        start = dt.datetime.now()
        print(f'Started at {time_()}')
        retrived_prices = retrive_prices()
        geo_df = retrive_stations_and_merge(retrived_prices)
        print(f'Retrived all the information, start processing at {time_()}')
        storage = process(geo_df)
        print(f'Retrived all the information, start saving at {time_()}')
        save(storage)
        print(f'finished at {time_()}, total time={dt.datetime.now() - start}')
    
    if args.new:
        refresh_stations()


if __name__ == '__main__':
    main()