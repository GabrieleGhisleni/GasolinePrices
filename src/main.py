from retrive_stations import *
from data_process import *
from data_fetch import *
import datetime as dt
import argparse


def main():
    def time_(): return dt.datetime.now().strftime("%H:%M:%S")
    arg_parse = argparse.ArgumentParser(description='Argument for GitHub Actions')
    arg_parse.add_argument('-n', '--new', action='store_true')
    arg_parse.add_argument('-d', '--default', action='store_true')
    args = arg_parse.parse_args()
 
    if args.new:
        refresh_stations()
    else:
        print(f'Started at {time_()}, {dt.datetime.now().strftime("%m-%d-%Y")}')
        start = dt.datetime.now()

        today_price = retrive_prices()
        station_manager = Stations()
        italian_stations = station_manager.load_station()
        municipalities = station_manager.load_italian_municipalities()
        print(f'Retrived all the information, start processing at {time_()}')

        processor = DataProcess(municipalities, today_price, italian_stations)
        processor.extract_cheap_stations()
        print(f'finished at {time_()}, total time={dt.datetime.now() - start}')
    

if __name__ == '__main__':
    main()

