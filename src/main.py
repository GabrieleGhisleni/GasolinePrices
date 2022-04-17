from fetch_and_save import FetchSave 
from static_stations import StaticStations
import datetime as dt
import argparse



def main():
    def time_(): return dt.datetime.now().strftime("%H:%M:%S")
    arg_parse = argparse.ArgumentParser(description='Argument for GitHub Actions')
    arg_parse.add_argument('-n', '--new', action='store_true')
    arg_parse.add_argument('-d', '--default', action='store_true')
    args = arg_parse.parse_args()
 
    if args.new:
        static = StaticStations()
        static.update_static_storage()
    elif args.default:
        FetchSave().update_daily_storage()


if __name__ == '__main__':
    "IoniC2"
    main()

