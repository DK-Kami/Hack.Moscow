import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsFunnel from 'highcharts/modules/funnel';
import HighchartsVue from 'highcharts-vue';

highchartsMore(Highcharts);
highchartsFunnel(Highcharts);

export default HighchartsVue;