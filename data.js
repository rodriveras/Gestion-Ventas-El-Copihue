/**
 * DATA MODULE - Hacienda El Copihue
 * Unifies all GeoJSON layers into a single collection with enriched schema.
 * Persists changes to localStorage (simulating Supabase).
 */

const DataModule = (() => {
    const STORAGE_KEY = 'hacienda_copihue_lotes';
    const SYNC_QUEUE_KEY = 'hacienda_copihue_sync_queue';
    const LAST_UPDATE_KEY = 'hacienda_copihue_last_update';

    // ── Raw GeoJSON from qgis2web ──
    const rawDisponibles = {"type":"FeatureCollection","name":"Disponibles_2","features":[{"type":"Feature","properties":{"fid":"1","Lote":"17","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.779619773753595,-36.118638270230832],[-71.780073842297497,-36.118085810602132],[-71.779483165499997,-36.117760925199988],[-71.779026411602374,-36.118316560668305],[-71.779619773753595,-36.118638270230832]]]]}},{"type":"Feature","properties":{"fid":"2","Lote":"18","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778911314211626,-36.118295608683773],[-71.778936322195491,-36.118265944141697],[-71.779026411602374,-36.118316560668305],[-71.779483165499997,-36.117760925199988],[-71.778895162,-36.11743750450001],[-71.778543997300005,-36.11786475489999],[-71.778539819700001,-36.11786983759999],[-71.778412669299996,-36.118024535899998],[-71.778911314211626,-36.118295608683773]]]]}},{"type":"Feature","properties":{"fid":"3","Lote":"19","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778099888900002,-36.118405079099993],[-71.778974356927321,-36.118880454427277],[-71.779254417904326,-36.11852655238679],[-71.778886960465229,-36.118324497141387],[-71.778911314211626,-36.118295608683773],[-71.778412669299996,-36.118024535899998],[-71.778250747300007,-36.118221538299991],[-71.778099888900002,-36.118405079099993]]]]}},{"type":"Feature","properties":{"fid":"6","Lote":"23","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 35.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778074548953299,-36.120015813963533],[-71.777176689599997,-36.119528261200003],[-71.776873804800005,-36.119896748599999],[-71.777778790869831,-36.120388716746909],[-71.778074548953299,-36.120015813963533]]]]}},{"type":"Feature","properties":{"fid":"10","Lote":"28","Area":"5.440 m2","Estado":"Disponible","Precio":"$ 35.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.776003377500004,-36.121563478299997],[-71.775678878299999,-36.121994290799996],[-71.776422639497753,-36.122445349348027],[-71.776779719581157,-36.122013287655903],[-71.776008881927808,-36.121556170435774],[-71.776003377500004,-36.121563478299997]]]]}},{"type":"Feature","properties":{"fid":"12","Lote":"30","Area":"5.200 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.775298280300007,-36.122499574499997],[-71.775290377900006,-36.122509517199994],[-71.775249246,-36.122561268900007],[-71.775141323200003,-36.122697055800003],[-71.774964000799997,-36.122934743199991],[-71.775668301276383,-36.123358063065083],[-71.776049543815958,-36.122896792096412],[-71.775328465300007,-36.122459501100003],[-71.775312465100001,-36.122480742899995],[-71.775301228900005,-36.12249566],[-71.775298280300007,-36.122499574499997]]]]}},{"type":"Feature","properties":{"fid":"13","Lote":"31","Area":"5.200 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.775668301276383,-36.123358063065083],[-71.774964000799997,-36.122934743199991],[-71.774942217700001,-36.122963941700007],[-71.774817372399994,-36.123123615899999],[-71.774734097,-36.12323012280001],[-71.774625520399994,-36.123372432799989],[-71.774592144,-36.123416178799999],[-71.775274757359085,-36.12383425099987],[-71.775668301276383,-36.123358063065083]]]]}},{"type":"Feature","properties":{"fid":"14","Lote":"43","Area":"5.121 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.775312465100001,-36.122480742899995],[-71.775328465300007,-36.122459501100003],[-71.775678878299999,-36.121994290799996],[-71.776003377500004,-36.121563478299997],[-71.776008881927808,-36.121556170435774],[-71.775636309622769,-36.121335230079907],[-71.774948257899993,-36.122247318200017],[-71.775021691299997,-36.1222943828],[-71.775260817700001,-36.122447641699999],[-71.775312465100001,-36.122480742899995]]]]}},{"type":"Feature","properties":{"fid":"15","Lote":"44","Area":"5.097 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.774948257899993,-36.122247318200017],[-71.775636309622769,-36.121335230079907],[-71.775259539269726,-36.121111781527055],[-71.774581417899995,-36.122012203499999],[-71.774791585599999,-36.122146904300003],[-71.7748894769,-36.122209644499989],[-71.774948257899993,-36.122247318200017]]]]}},{"type":"Feature","properties":{"fid":"16","Lote":"45","Area":"5.082 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.774581417899995,-36.122012203499999],[-71.775259539269726,-36.121111781527055],[-71.774880537059204,-36.120887027607083],[-71.774210798200002,-36.1217746636],[-71.774240149199997,-36.121793475500006],[-71.774309240500003,-36.121837758099993],[-71.774456213400001,-36.121931956900006],[-71.774544828200007,-36.121988752299991],[-71.774581417899995,-36.122012203499999]]]]}},{"type":"Feature","properties":{"fid":"18","Lote":"47","Area":"5.700 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.776309076,-36.12058378270001],[-71.775855902649369,-36.120326364200253],[-71.775660959206121,-36.120561348914642],[-71.775276232546418,-36.121030880082436],[-71.775723099350728,-36.121295760538011],[-71.775978922700006,-36.120985431800008],[-71.776274973400007,-36.120625270500007],[-71.776309076,-36.12058378270001]]]]}},{"type":"Feature","properties":{"fid":"19","Lote":"48","Area":"5.300 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.775783041300002,-36.120284941300007],[-71.776309076,-36.12058378270001],[-71.776573250400006,-36.120262396799994],[-71.776873804800005,-36.119896748599999],[-71.776347773,-36.119597909599996],[-71.775975878699995,-36.120050344],[-71.775783041300002,-36.120284941300007]]]]}},{"type":"Feature","properties":{"fid":"20","Lote":"49","Area":"5.400 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.774889915520703,-36.12013128998862],[-71.774547820247079,-36.120599338878726],[-71.775203132356921,-36.120987786902248],[-71.775591693300001,-36.120517725100001],[-71.774889915520703,-36.12013128998862]]]]}},{"type":"Feature","properties":{"fid":"22","Lote":"51","Area":"5.684 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.775528747178669,-36.11913917977288],[-71.775438097229426,-36.119270097603561],[-71.775342915046949,-36.119449623818099],[-71.775325825690558,-36.119480534629588],[-71.775315580263836,-36.119499124245927],[-71.77523407497759,-36.11964139342313],[-71.775975878699995,-36.120050344],[-71.776347773,-36.119597909599996],[-71.776170485099996,-36.119497191100017],[-71.775656943,-36.119205441399998],[-71.775528747178669,-36.11913917977288]]]]}},{"type":"Feature","properties":{"fid":"23","Lote":"53","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.776636973,-36.119021221499999],[-71.777285574100006,-36.11939579220001],[-71.77748196,-36.119156867599983],[-71.777484037,-36.119154340699993],[-71.777724488,-36.1188618037],[-71.777152167899999,-36.118495546299989],[-71.776636973,-36.119021221499999]]]]}},{"type":"Feature","properties":{"fid":"24","Lote":"54","Area":"5.083 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.776113202017925,-36.118721256753922],[-71.775822948392999,-36.118934075416419],[-71.775626018885291,-36.11907867711929],[-71.775546364889749,-36.119129810167685],[-71.775528747178669,-36.11913917977288],[-71.775656943,-36.119205441399998],[-71.776170485099996,-36.119497191100017],[-71.776607962297589,-36.11904918387615],[-71.776113202017925,-36.118721256753922]]]]}},{"type":"Feature","properties":{"fid":"25","Lote":"55","Area":"5.050 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777152167899999,-36.118495546299989],[-71.77672114922531,-36.118219714692785],[-71.776176380573489,-36.118672745711571],[-71.776661169027534,-36.118991942766165],[-71.776636973,-36.119021221499999],[-71.777152167899999,-36.118495546299989]]]]}},{"type":"Feature","properties":{"fid":"26","Lote":"56","Area":"5.240 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777724488,-36.1188618037],[-71.777789673200004,-36.118782497799991],[-71.777978690300003,-36.118552533900008],[-71.777045513216407,-36.117948832119104],[-71.77672114922531,-36.118219714692785],[-71.776790395800006,-36.118264026199995],[-71.777152167899999,-36.118495546299989],[-71.777724488,-36.1188618037]]]]}},{"type":"Feature","properties":{"fid":"27","Lote":"57","Area":"5.200 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777388736047683,-36.117664545812886],[-71.777045513216407,-36.117948832119104],[-71.777978690300003,-36.118552533900008],[-71.778099888900002,-36.118405079099993],[-71.778250747300007,-36.118221538299991],[-71.777388736047683,-36.117664545812886]]]]}},{"type":"Feature","properties":{"fid":"28","Lote":"58","Area":"5.200 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777758395546726,-36.117357136458317],[-71.777388736047683,-36.117664545812886],[-71.778250747300007,-36.118221538299991],[-71.778412669299996,-36.118024535899998],[-71.778539819700001,-36.11786983759999],[-71.778543997300005,-36.11786475489999],[-71.777758395546726,-36.117357136458317]],[[-71.777758406923454,-36.117357126997362],[-71.777627238899996,-36.117272388100005],[-71.777758395546726,-36.117357136458317],[-71.777758406923454,-36.117357126997362]]]]}},{"type":"Feature","properties":{"fid":"30","Lote":"27","Area":"5.002 m2","Estado":"Disponible","Precio":"$ 35.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.776905843582213,-36.121489326238475],[-71.775978877534484,-36.120985411967922],[-71.775723099350728,-36.121295760538011],[-71.776631909817425,-36.121834693842146],[-71.776905843582213,-36.121489326238475]]]]}},{"type":"Feature","properties":{"fid":"31","Lote":"26","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777194637698656,-36.121125219355868],[-71.776274973400007,-36.120625270500007],[-71.775978922700006,-36.120985431800008],[-71.776905843582213,-36.121489326238475],[-71.777194637698656,-36.121125219355868]]]]}},{"type":"Feature","properties":{"fid":"32","Lote":"50","Area":"5.400 m2","Estado":"Disponible","Precio":"$ 33.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.77523407497759,-36.11964139342313],[-71.774889915520703,-36.12013128998862],[-71.775591693300001,-36.120517725100001],[-71.775783041300002,-36.120284941300007],[-71.775975878699995,-36.120050344],[-71.77523407497759,-36.11964139342313]]]]}},{"type":"Feature","properties":{"fid":"33","Lote":"24","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 35.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777778790869831,-36.120388716746909],[-71.776873804800005,-36.119896748599999],[-71.776573250400006,-36.120262396799994],[-71.777485603550147,-36.120758370456279],[-71.777778790869831,-36.120388716746909]]]]}},{"type":"Feature","properties":{"fid":"34","Lote":"25","Area":"5.000 m2","Estado":"Disponible","Precio":"$ 35.000.000"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777485603550147,-36.120758370456279],[-71.776573250400006,-36.120262396799994],[-71.776309076,-36.12058378270001],[-71.776274973400007,-36.120625270500007],[-71.777194637698656,-36.121125219355868],[-71.777485603550147,-36.120758370456279]]]]}}]};

    const rawReservadas = {"type":"FeatureCollection","name":"Reservadas_4","features":[{"type":"Feature","properties":{"fid":"2","Lote":"22","Area":"5.000 m2","Precio":"$ 5.000.00","Estado":"Reservada","interesado_nom":null,"telefono":null,"mail":null,"vendedor":null,"fecha_reserva":null,"fecha_vencimiento":null,"dias_restantes":null,"estado_reserva":null,"monto_reserva":null,"metodo_reserva":null,"monto_pactado":null,"comprobante_url":null},"geometry":{"type":"Polygon","coordinates":[[[-71.7784090607,-36.119660856],[-71.77748196,-36.119156867599983],[-71.777285574100006,-36.11939579220001],[-71.777176689599997,-36.119528261200003],[-71.778111161499993,-36.120036257499997],[-71.778114266200006,-36.120032345],[-71.7784090607,-36.119660856]]]}},{"type":"Feature","properties":{"fid":"3","Lote":"5","Area":"5.200 m2","Precio":null,"Estado":"Reservada","interesado_nom":null,"telefono":null,"mail":null,"vendedor":null,"fecha_reserva":null,"fecha_vencimiento":null,"dias_restantes":null,"estado_reserva":null,"monto_reserva":null,"metodo_reserva":null,"monto_pactado":null,"comprobante_url":null},"geometry":{"type":"Polygon","coordinates":[[[-71.777147319,-36.122943113599987],[-71.776457120910251,-36.122536034480035],[-71.776119503752298,-36.122946134810469],[-71.776065762103357,-36.123007868673255],[-71.776770962599997,-36.1234269897],[-71.776807511100003,-36.123383354799998],[-71.777147319,-36.122943113599987]]]}},{"type":"Feature","properties":{"fid":"4","Lote":"6","Area":"5.442 m2","Precio":null,"Estado":"Reservada","interesado_nom":null,"telefono":null,"mail":null,"vendedor":null,"fecha_reserva":null,"fecha_vencimiento":null,"dias_restantes":null,"estado_reserva":null,"monto_reserva":null,"metodo_reserva":null,"monto_pactado":null,"comprobante_url":null},"geometry":{"type":"Polygon","coordinates":[[[-71.777548520500005,-36.122423326399996],[-71.776875399319337,-36.122025069822627],[-71.776457120910251,-36.122536034480035],[-71.777147319,-36.122943113599987],[-71.777548520500005,-36.122423326399996]]]}},]};

    const rawVendidas = {"type":"FeatureCollection","name":"Vendidas_3","features":[{"type":"Feature","properties":{"fid":"1","Lote":"3","Area":"5.200 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.776377521599997,-36.123896711599997],[-71.775673418266422,-36.123481264683512],[-71.775282799183628,-36.123954759500741],[-71.775985302899997,-36.124371304199997],[-71.7760294184,-36.12431230020001],[-71.776316948499996,-36.123969028200001],[-71.776377521599997,-36.123896711599997]]]]}},{"type":"Feature","properties":{"fid":"2","Lote":"4","Area":"5.200 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.776770962599997,-36.1234269897],[-71.776065762103357,-36.123007868673255],[-71.775673418266422,-36.123481264683512],[-71.776377521599997,-36.123896711599997],[-71.776770962599997,-36.1234269897]]]]}},{"type":"Feature","properties":{"fid":"5","Lote":"7","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.77783844182251,-36.122055651563265],[-71.776943397064429,-36.121574596830442],[-71.776702069035593,-36.121876471768786],[-71.776899540065585,-36.121995106159098],[-71.776875399319337,-36.122025069822627],[-71.777548535099996,-36.1224233075],[-71.777692646099993,-36.122236598699985],[-71.77783844182251,-36.122055651563265]]]]}},{"type":"Feature","properties":{"fid":"6","Lote":"9","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778459870800006,-36.121286587400007],[-71.777557310874045,-36.120797538915951],[-71.777261912224958,-36.121170065185993],[-71.778160558899998,-36.121658574099996],[-71.778186726900003,-36.121626247699993],[-71.778459870800006,-36.121286587400007]]]]}},{"type":"Feature","properties":{"fid":"7","Lote":"10","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778757179500005,-36.120914998699995],[-71.777854438717483,-36.120424265569781],[-71.777558192583143,-36.120796431253737],[-71.778459870800006,-36.121286587400007],[-71.778672244800006,-36.121022493299989],[-71.778757179500005,-36.120914998699995]]]]}},{"type":"Feature","properties":{"fid":"8","Lote":"11","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.779052524299999,-36.120542385199997],[-71.778150658879071,-36.120052128448933],[-71.777854438717483,-36.120424265569781],[-71.778757179500005,-36.120914998699995],[-71.779013134899998,-36.120591055599995],[-71.779052524299999,-36.120542385199997]]]]}},{"type":"Feature","properties":{"fid":"9","Lote":"12","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.7793494071,-36.120171792099995],[-71.778445734142949,-36.119681425605542],[-71.778445734142949,-36.119681425605542],[-71.778150658879071,-36.120052128448933],[-71.779052524299999,-36.120542385199997],[-71.779319624899998,-36.12021234769999],[-71.7793494071,-36.120171792099995]]]]}},{"type":"Feature","properties":{"fid":"10","Lote":"13","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.779630971800003,-36.119788371100007],[-71.77874414040086,-36.119306078610741],[-71.778445734142949,-36.119681425605542],[-71.7793494071,-36.120171792099995],[-71.779630971800003,-36.119788371100007]]]]}},{"type":"Feature","properties":{"fid":"11","Lote":"14","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.779917447399995,-36.119398258300009],[-71.779047031731039,-36.118925099415137],[-71.77874414040086,-36.119306078610741],[-71.779630971800003,-36.119788371100007],[-71.779917447399995,-36.119398258300009]]]]}},{"type":"Feature","properties":{"fid":"12","Lote":"15","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.779047031731039,-36.118925099415137],[-71.779917447399995,-36.119398258300009],[-71.7799848027,-36.119306535600003],[-71.780209099713744,-36.119001089662049],[-71.779688695468309,-36.118718199037048],[-71.7796622965447,-36.11874923051581],[-71.779330782890128,-36.118568184737576],[-71.779047031731039,-36.118925099415137]]]]}},{"type":"Feature","properties":{"fid":"13","Lote":"16","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.780073842299998,-36.118085810599986],[-71.779619773753595,-36.118638270230832],[-71.779713332891191,-36.118689238145741],[-71.779688695468309,-36.118718199037048],[-71.779688695468309,-36.118718199037048],[-71.7802091004,-36.119001090599994],[-71.780649965500004,-36.118400720300002],[-71.780591443600002,-36.118369220999988],[-71.780482855800003,-36.118310773700003],[-71.780073842299998,-36.118085810599986]]]]}},{"type":"Feature","properties":{"fid":"14","Lote":"52","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.777285574100006,-36.11939579220001],[-71.776636973,-36.119021221499999],[-71.776170485099996,-36.119497191100017],[-71.776347773,-36.119597909599996],[-71.776873804800005,-36.119896748599999],[-71.777176689599997,-36.119528261200003],[-71.777285574100006,-36.11939579220001]]]]}},{"type":"Feature","properties":{"fid":"15","Lote":"8","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778160558899998,-36.121658574099996],[-71.777261912224958,-36.121170065185993],[-71.776983618135432,-36.121521017231053],[-71.777884062172845,-36.12199858595892],[-71.778160558899998,-36.121658574099996]]]]}},{"type":"Feature","properties":{"fid":"17","Lote":"20","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778974356927321,-36.118880454427277],[-71.778099888900002,-36.118405079099993],[-71.777978690300003,-36.118552533900008],[-71.777789673200004,-36.118782497799991],[-71.778672874328564,-36.119261422030064],[-71.778974356927321,-36.118880454427277],[-71.778974356927321,-36.118880454427277]]]]}},{"type":"Feature","properties":{"fid":"21","Lote":"21","Area":"5.000 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.778709343700001,-36.119282446399993],[-71.777789673200004,-36.118782497799991],[-71.777724488,-36.1188618037],[-71.777484037,-36.119154340699993],[-71.77748196,-36.119156867599983],[-71.7784090607,-36.119660856],[-71.778409193,-36.119660689299984],[-71.778706612899995,-36.119285887800004],[-71.778709343700001,-36.119282446399993]]]]}},{"type":"Feature","properties":{"fid":"22","Lote":"46","Area":"6.049 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.774880537059204,-36.120887027607083],[-71.774491142464953,-36.120656099471312],[-71.773839515099993,-36.121536695899991],[-71.773927109200002,-36.1215928381],[-71.774117316900004,-36.121714748600006],[-71.774120778599993,-36.121716967300003],[-71.774210798200002,-36.1217746636],[-71.774880537059204,-36.120887027607083]]]]}},{"type":"Feature","properties":{"fid":"23","Lote":"29","Area":"5.200 m2","Estado":"Vendida"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-71.775328465300007,-36.122459501100003],[-71.776049543815958,-36.122896792096412],[-71.776422639497753,-36.122445349348027],[-71.775678878299999,-36.121994290799996],[-71.775328465300007,-36.122459501100003]]]]}}]};

    // ── Parse price string to number ──
    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    }

    // ── Format number to CLP ──
    function formatPrice(num) {
        if (!num) return '$ 0';
        return '$ ' + num.toLocaleString('es-CL');
    }

    // ── Normalize geometry to simple Polygon ──
    function normalizeGeometry(geometry) {
        if (geometry.type === 'MultiPolygon') {
            return {
                type: 'Polygon',
                coordinates: geometry.coordinates[0]
            };
        }
        return geometry;
    }

    // ── Build unified lotes collection ──
    function buildUnifiedCollection() {
        const allFeatures = [];
        
        const processBatch = (fc, defaultEstado) => {
            fc.features.forEach(f => {
                const props = f.properties;
                allFeatures.push({
                    type: 'Feature',
                    properties: {
                        id_lote: props.Lote,
                        fid: props.fid,
                        area: props.Area || '',
                        estado: props.Estado || defaultEstado,
                        precio: parsePrice(props.Precio),
                        precio_display: props.Precio || formatPrice(parsePrice(props.Precio)),
                        ultima_modificacion: new Date().toISOString(),
                        comprobante_url: props.comprobante_url || null,
                        interesado_nom: props.interesado_nom || null,
                        telefono: props.telefono || null,
                        mail: props.mail || null,
                        vendedor: props.vendedor || null,
                        fecha_reserva: props.fecha_reserva || null,
                        fecha_vencimiento: props.fecha_vencimiento || null,
                        dias_restantes: props.dias_restantes || null,
                        estado_reserva: props.estado_reserva || null,
                        monto_reserva: props.monto_reserva || null,
                        metodo_reserva: props.metodo_reserva || null,
                        monto_pactado: props.monto_pactado || null,
                    },
                    geometry: normalizeGeometry(f.geometry)
                });
            });
        };

        processBatch(rawDisponibles, 'Disponible');
        processBatch(rawReservadas, 'Reservada');
        processBatch(rawVendidas, 'Vendida');

        return {
            type: 'FeatureCollection',
            features: allFeatures
        };
    }

    // ── Public API ──
    return {
        STORAGE_KEY,
        SYNC_QUEUE_KEY,
        LAST_UPDATE_KEY,

        init() {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                const collection = buildUnifiedCollection();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
                localStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());
            }
            return this.getAll();
        },

        reset() {
            const collection = buildUnifiedCollection();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
            localStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());
            localStorage.removeItem(SYNC_QUEUE_KEY);
            return collection;
        },

        getAll() {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : buildUnifiedCollection();
        },

        getLoteById(id_lote) {
            const collection = this.getAll();
            return collection.features.find(f => f.properties.id_lote === id_lote);
        },

        updateLote(id_lote, updates) {
            const collection = this.getAll();
            const feature = collection.features.find(f => f.properties.id_lote === id_lote);
            if (feature) {
                Object.assign(feature.properties, updates);
                feature.properties.ultima_modificacion = new Date().toISOString();
                if (updates.precio !== undefined) {
                    feature.properties.precio_display = formatPrice(updates.precio);
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
                localStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());

                // Add to sync queue
                this.addToSyncQueue({
                    id_lote,
                    updates,
                    timestamp: new Date().toISOString()
                });
            }
            return feature;
        },

        addToSyncQueue(change) {
            const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
            queue.push(change);
            localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
        },

        getSyncQueue() {
            return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
        },

        clearSyncQueue() {
            localStorage.setItem(SYNC_QUEUE_KEY, '[]');
        },

        getStats() {
            const collection = this.getAll();
            const stats = { disponible: 0, reservada: 0, vendida: 0, total: 0 };
            collection.features.forEach(f => {
                const estado = f.properties.estado.toLowerCase();
                if (estado === 'disponible') stats.disponible++;
                else if (estado === 'reservada') stats.reservada++;
                else if (estado === 'vendida') stats.vendida++;
                stats.total++;
            });
            return stats;
        },

        getLastUpdate() {
            return localStorage.getItem(LAST_UPDATE_KEY) || new Date().toISOString();
        },

        formatPrice,
        parsePrice
    };
})();
