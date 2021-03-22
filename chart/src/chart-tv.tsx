import * as React from 'react';
import './chart-tv.css';
import {
	widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	IChartingLibraryWidget,
  IExternalSaveLoadAdapter,
} from './charting_library/charting_library.min';

export interface TVChartContainerProps {
	symbol: ChartingLibraryWidgetOptions['symbol'];
	interval: ChartingLibraryWidgetOptions['interval'];	
	datafeedUrl: string; // BEWARE: no trailing slash is expected in feed URL
	libraryPath: ChartingLibraryWidgetOptions['library_path'];
	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
	clientId: ChartingLibraryWidgetOptions['client_id'];
	userId: ChartingLibraryWidgetOptions['user_id'];
	fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
	autosize: ChartingLibraryWidgetOptions['autosize'];
	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
	containerId: ChartingLibraryWidgetOptions['container_id'];
	indicators_file_name: string;
}

function getLanguageFromURL(): string {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return !results ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')); // as unknown as LanguageCode;
}

export class ChartTV extends React.Component<TVChartContainerProps, {}> {
	static defaultProps: TVChartContainerProps = {
    symbol: 'BTCUSDT', // .BXBT',
    interval: '1',
    // interval: 'D',
    containerId: 'tv_chart_container',
    // datafeedUrl: 'https://demo_feed.tradingview.com',
    datafeedUrl: '/api',
    // datafeedUrl: 'http://localhost:8889',
    // datafeedUrl: 'https://www.bitmex.com/api/udf',
    libraryPath: '/charting_library/',
    // chartsStorageUrl: 'https://saveload.tradingview.com',
    indicators_file_name: 'custom-indicators',
    chartsStorageUrl: '',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {}
	};

	tvWidget: IChartingLibraryWidget | null = null;

	componentDidMount(): void {
    const {
      symbol,
      interval,
      containerId,
      libraryPath,
      chartsStorageUrl,
      datafeedUrl,
      chartsStorageApiVersion,
      clientId,
      userId,
      fullscreen,
      autosize,
      studiesOverrides,
    } = this.props;
    const DataFeedClass = (window as any).Datafeeds.UDFCompatibleDatafeed;
    const datafeed = new DataFeedClass(datafeedUrl);
    const locale = (getLanguageFromURL() || 'en') as LanguageCode;
    const disabled_features = ['use_localstorage_for_settings'];

		const widgetOptions: ChartingLibraryWidgetOptions = {
			symbol,
			datafeed,
			interval,
			container_id: containerId,
			library_path: libraryPath,
			locale,
			disabled_features,
			charts_storage_url: chartsStorageUrl,
			charts_storage_api_version: chartsStorageApiVersion,
			client_id: clientId,
			user_id: userId,
			fullscreen,
			autosize,
			studies_overrides: studiesOverrides,
      debug: true
		};
    const tvWidget = this.tvWidget = new widget(widgetOptions);
		tvWidget.onChartReady( () => {
      tvWidget.changeTheme( 'Dark' );
  		tvWidget.chart().removeAllStudies();
  		tvWidget.chart().createStudy('test', false, true);
		});
	}

	componentWillUnmount(): void {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div id={ this.props.containerId } className={ 'TVChartContainer' } />
		);
	}
}
